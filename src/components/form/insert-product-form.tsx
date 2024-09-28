"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  ScrollShadow,
  Textarea,
  cn,
} from "@nextui-org/react";
import {
  type ReactNode,
  useCallback,
  useRef,
  useState,
  PropsWithChildren,
  Fragment,
} from "react";
import { ImageURLUpload, ImageUpload } from ".";
import { useMutation, useQuery } from "@tanstack/react-query";
import { commonService, productService } from "@/apis";
import type { InsertProduct } from "@/types";
import { useModalStore } from "@/stores";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload } from "lucide-react";

interface ICustomCard {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

const intialValues: InsertProduct = {
  product_name: "",
  brand: "",
  description: undefined,
  category_name: "",
  price: 0,
  stock_amount: 0,
  sold_amount: 0,
  discount_percent: undefined,
  discount_price: undefined,
  discount_start_date: undefined,
  discount_end_date: undefined,
  product_image: [],
};

const MAX_IMAGE_URL = 5;

export default function InsertProductForm() {
  const router = useRouter();

  const imgUrlRef = useRef<string[]>([]);

  const [values, setValues] = useState<InsertProduct>(intialValues);
  const [productImages, setProductImages] = useState<(Blob | File)[]>([]);
  const [isShowUploadMainImageUrl, setIsShowUploadMainImageUrl] =
    useState(false);
  const [mainImageUrl, setMainImageUrl] = useState("");

  const { setModalState } = useModalStore();

  const { data: categories, isFetching } = useQuery({
    queryKey: ["product-categories"],
    queryFn: productService.getCategoryList,
    select: ({ data }) => data?.data || [],
  });

  const insertProduct = useMutation({
    mutationFn: productService.insertProductItem,
    onSuccess: (res) => {
      if (res.success) {
        setModalState({
          isOpen: true,
          title: "สร้างสินค้าใหม่เรียบร้อย",
          onOk: () => router.push("/business/products"),
        });
        imgUrlRef.current = [];
        resetValues();
      }
    },
    onError: (e) => console.log(e),
  });

  const uploadMutation = useMutation({
    mutationFn: commonService.uploadImage,
    onSuccess: (res) => {
      if (res.url) {
        imgUrlRef.current.push(res.url);
      }

      if (imgUrlRef.current.length === productImages.length) {
        const insertParams = {
          data: [{ ...values, product_image: imgUrlRef.current }],
        };

        insertProduct.mutate(insertParams);
      }
    },
    onError: (e) => console.log(e),
  });

  const resetValues = useCallback(() => setValues(intialValues), []);

  const handleUpdateValue = useCallback(
    (key: keyof InsertProduct, value: number | string) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // const categoryOptions = useMemo(
  //   () =>
  //     categories?.map((category) => ({
  //       key: category.name,
  //       value: category.name,
  //     })),
  //   [categories]
  // );

  // const handleCreateProduct = async () => {
  //   if (values?.product_image && values.product_image.length >= 1) {
  //     insertProduct.mutate({ data: [values] });

  //     return;
  //   }

  //   let formDataList = [];
  //   for (let index = 0; index < productImages.length; index++) {
  //     const imageFile = productImages[index];
  //     const form = new FormData();

  //     form.append("image", imageFile);
  //     formDataList.push(form);
  //   }

  //   for (let formData of formDataList) {
  //     uploadMutation.mutate(formData);
  //   }
  // };

  return (
    <div className="w-full px-3">
      <ScrollShadow className="h-[calc(100vh-220px)] py-2">
        <div className="flex flex-col space-y-4">
          <CustomCard title={"ข้อมูลทั่วไป"} className="flex-1">
            <div className="flex space-y-3 flex-col">
              <Input
                isRequired
                label={"ชื่อสินค้า"}
                name="product_name"
                value={values.product_name}
                onChange={({ target: { value } }) =>
                  handleUpdateValue("product_name", value)
                }
              />
              <Input
                isRequired
                label={"แบรนด์สินค้า"}
                name="brand"
                value={values.brand}
                onChange={({ target: { value } }) =>
                  handleUpdateValue("brand", value)
                }
              />
              <Textarea
                label={"คำอธิบายสินค้า"}
                name="description"
                value={values.description}
                className="max-h-[200px] resize-none"
                onChange={({ target: { value } }) =>
                  handleUpdateValue("description", value)
                }
              />
            </div>
          </CustomCard>

          <CustomCard title={"รูปภาพสินค้า"}>
            <div className="flex justify-between pr-4 py-1">
              <h2 className="text-sm mb-2">{"รูปภาพหลัก 1 รูป"}</h2>
              <p
                onClick={() => setIsShowUploadMainImageUrl((prev) => !prev)}
                className="text-sm flex items-center text-[#FF731D] cursor-pointer duration-200 transition-all hover:opacity-60"
              >
                {isShowUploadMainImageUrl ? (
                  <Upload className="w-4 h-4 mr-1" />
                ) : (
                  <Plus className="w-4 h-4 mr-1" />
                )}
                {isShowUploadMainImageUrl
                  ? "อัพโหลดรูปภาพจากเครื่อง"
                  : "อัพโหลดด้วยลิงก์"}
              </p>
            </div>
            {isShowUploadMainImageUrl ? (
              <div>
                <img
                  src={mainImageUrl || "/images/no-image.jpg"}
                  className={cn(
                    "h-[300px] mb-2 rounded-lg mx-auto",
                    mainImageUrl ? "border border-slate-50" : undefined
                  )}
                />
                <Input
                  label={"ลิงก์รูปภาพหลัก"}
                  value={mainImageUrl}
                  isRequired
                  isReadOnly={!!mainImageUrl}
                  endContent={
                    <Button
                      isDisabled={!mainImageUrl}
                      isIconOnly
                      size="sm"
                      variant="light"
                      role="delete-main-image"
                      color={mainImageUrl ? "danger" : "default"}
                      onClick={() => setMainImageUrl("")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  }
                  onChange={(e) => setMainImageUrl(e.target.value.trim())}
                />
              </div>
            ) : (
              <ImageUpload
                max={1}
                onFileUpload={(blob) => {
                  console.log(blob);
                }}
                width={400}
                height={400}
                fullPreview
              />
            )}
            <div
              aria-label="other-image-upload"
              className="flex-col flex space-y-2 my-3"
            >
              <h2 className="text-sm">{`รูปภาพอื่นๆ (มากสุด ${MAX_IMAGE_URL} รูป)`}</h2>
              <ImageURLUpload max={MAX_IMAGE_URL} />
            </div>
          </CustomCard>

          {/* <div className="flex flex-col space-y-3">
          <CustomCard title={"หมวดหมู่"}>
            <SelectOption
              isRequired
              label={"หมวดหมู่สินค้า"}
              isLoading={isFetching}
              options={categoryOptions || []}
              name="category_name"
              value={values.category_name}
              onSelectionChange={(e) =>
                e.anchorKey && handleUpdateValue("category_name", e.anchorKey)
              }
            />
          </CustomCard>
          <CustomCard title={"คลังสินค้า"}>
            <Input
              label={"จำนวนคลัง"}
              name="stock_amount"
              value={values.stock_amount?.toString()}
              onChange={({ target: { value } }) =>
                handleUpdateValue("stock_amount", +numberOnly(value))
              }
            />
          </CustomCard>
        </div> */}

          {/* <CustomCard title={"ราคา"} className="flex-1">
          <div className="flex flex-col space-y-3">
            <Input
              isRequired
              label={"ราคาสินค้า"}
              name="price"
              value={values.price.toString()}
              onChange={({ target: { value } }) =>
                handleUpdateValue("price", +value)
              }
            />
          </div>
        </CustomCard> */}

          {/* <CustomCard
          title={"รูปภาพสินค้า"}
          description={"อัพโหลดรูปมากที่สุดจำนวน 2 รูปภาพ"}
        >
          <ImageUpload
            max={2}
            onFileUpload={setProductImages}
            onImageUrlChange={(product_image) =>
              setValues((prev) => ({ ...prev, product_image }))
            }
            width={400}
            height={400}
          />
        </CustomCard> */}
        </div>
      </ScrollShadow>
      {/* <div className="flex w-full p-4 space-x-2 justify-center">
        <Button
          role="insert"
          onClick={handleCreateProduct}
          isDisabled={isEmpty(productImages) && isEmpty(values.product_image)}
          isLoading={
            isFetching || uploadMutation.isPending || insertProduct.isPending
          }
          className="w-[150px]"
          color="primary"
        >
          {"สร้างสินค้า"}
        </Button>
        <Button
          variant="bordered"
          className="w-[150px]"
          onClick={resetValues}
          isDisabled={uploadMutation.isPending || insertProduct.isPending}
        >
          {"ยกเลิก"}
        </Button>
      </div> */}
    </div>
  );
}

function CustomCard({ title, children, className, description }: ICustomCard) {
  return (
    <Card shadow="none" className={cn("border border-slate-100", className)}>
      <CardHeader className="flex flex-col items-start">
        <h2 className="text-md text-slate-800 font-medium">{title}</h2>
        {description && (
          <p className="text-gray-400 mt-1 font-normal text-xs">
            {description}
          </p>
        )}
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}

function Show({
  children,
  whenTruely = false,
}: Readonly<PropsWithChildren & { whenTruely?: boolean }>) {
  if (!whenTruely) return;

  return <Fragment>{children}</Fragment>;
}
