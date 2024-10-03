"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  DateRangePicker,
  Input,
  RadioGroup,
  ScrollShadow,
  Textarea,
  cn,
  Radio,
} from "@nextui-org/react";
import {
  type ReactNode,
  useCallback,
  useRef,
  useState,
  PropsWithChildren,
  Fragment,
  useMemo,
} from "react";
import { ImageURLUpload, ImageUpload, SelectOption } from ".";
import { useMutation } from "@tanstack/react-query";
import { productService } from "@/apis";
import type { InsertProduct } from "@/types";
import { useInsertProductStore, useModalStore } from "@/stores";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload } from "lucide-react";
import { useGetCategory } from "@/hooks";
import { InsertProductState } from "@/stores/use-insert-product";
import { useFormState } from "react-dom";
import { formSchemaAction } from "@/actions";
import { insertProductSchema } from "@/actions";
import { z } from "zod";
import { Modal } from "..";

interface ICustomCard {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  extra?: ReactNode;
}

const intialValues: InsertProductState = {
  product_name: "",
  brand: "",
  description: undefined,
  category_name: "",
  price: 1,
  stock_amount: 1,
  sold_amount: 0,
  discount_price: 0,
  discount_start_date: undefined,
  discount_end_date: undefined,
  product_images: [],
  product_main_image: "",
  is_preorder: false,
  shipping_provider: "",
  shipping_fee: 0,
  shipping_delivery_time: "",
};

const MAX_IMAGE_URL = 5;

export default function InsertProductForm() {
  const router = useRouter();

  const { values, setValues } = useInsertProductStore();

  const [err, formAction] = useFormState(
    () =>
      formSchemaAction(insertProductSchema, values, ({ data }) => {
        handleCreateProduct(data as z.infer<typeof insertProductSchema>);
      }),
    null
  );

  const [isShowUploadMainImageUrl, setIsShowUploadMainImageUrl] =
    useState(false);
  const [isShowDiscount, setIsShowDiscount] = useState(false);

  const { setModalState } = useModalStore();

  const { categories } = useGetCategory();

  const insertProduct = useMutation({
    mutationFn: productService.insertProductItem,
    onSuccess: (res) => {
      console.log(1, res);
      if (res.success) {
        setModalState({
          isOpen: true,
          title: "สร้างสินค้าใหม่เรียบร้อย",
          onOk: () => router.push("/business/products"),
        });
      }
    },
    onError: (e) => console.log(e),
  });

  const handleToggleDisplayDiscount = useCallback(
    () => setIsShowDiscount((prevShow) => !prevShow),
    []
  );

  const handleToggleDisplayUploadMainImageByURL = useCallback(
    () => setIsShowUploadMainImageUrl((prevShow) => !prevShow),
    []
  );

  // const uploadMutation = useMutation({
  //   mutationFn: commonService.uploadImage,
  //   onSuccess: (res) => {
  //     if (res.url) {
  //       imgUrlRef.current.push(res.url);
  //     }

  //     if (imgUrlRef.current.length === productImages.length) {
  //       const insertParams = {
  //         data: [{ ...values, product_image: imgUrlRef.current }],
  //       };

  //       insertProduct.mutate(insertParams);
  //     }
  //   },
  //   onError: (e) => console.log(e),
  // });

  const handleUpdateValue = useCallback(
    (key: keyof InsertProductState, value: number | string | boolean) => {
      setValues({ ...values, [key]: value });
    },
    [values]
  );

  const shippingProviders = useMemo(
    () => [
      { key: "flash", image: "/images/shipping/flash.jpg", label: "Flash" },
      { key: "kerry", image: "/images/shipping/kerry.jpg", label: "Kerry" },
      { key: "jandt", image: "/images/shipping/j&t.jpg", label: "J&T" },
    ],
    []
  );

  const deliveryTime = useMemo(
    () => [
      { key: "1", value: "1", label: "ภายใน 1 วัน" },
      { key: "3", value: "3", label: "ภายใน 3 วัน" },
      { key: "7", value: "7", label: "ภายใน 5-7 วัน" },
    ],
    []
  );

  const productCategories = useMemo(
    () =>
      categories?.map((item) => ({
        key: item.name,
        value: item.name,
      })) || [],
    [categories]
  );

  const handleCreateProduct = (data: z.infer<typeof insertProductSchema>) => {
    const mappedBody = {
      product_name: data.product_name,
      brand: data.brand,
      description: data.description,
      category_name: data.category_name,
      price: data.price,
      stock_amount: data.stock_amount,
      discount_price: data.discount_price,
      discount_start_date: data.discount_start_date,
      discount_end_date: data.discount_end_date,
      is_preorder: data.is_preorder,
      product_images: [
        { image: data.product_main_image, is_main: true },
      ].concat(data.product_images.map((image) => ({ image, is_main: false }))),
      provider: data.shipping_provider,
      delivery_time: data.shipping_delivery_time,
      shipping_fee: data.shipping_fee || 0,
    } as InsertProduct;

    insertProduct.mutate({ data: [mappedBody] });
  };

  return (
    <div className="w-full px-3 max-md:px-0">
      <ScrollShadow className="h-[calc(100vh-180px)] no-scrollbar pt-2 pb-[100px]">
        <form action={formAction}>
          <div className="flex flex-col space-y-4">
            <CustomCard title={"ข้อมูลทั่วไป"} className="flex-1">
              <WrapItem>
                <Input
                  isRequired
                  isInvalid={!!err?.product_name?.[0]}
                  errorMessage={err?.product_name?.[0]}
                  label={"ชื่อสินค้า"}
                  name="product_name"
                  value={values.product_name}
                  onChange={({ target: { value } }) =>
                    handleUpdateValue("product_name", value)
                  }
                />
                <Input
                  isRequired
                  isInvalid={!!err?.brand?.[0]}
                  errorMessage={err?.brand?.[0]}
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
                <Checkbox
                  aria-label="pre-order"
                  name="is_preorder"
                  classNames={{ label: "text-sm" }}
                  onChange={({ target: { checked } }) =>
                    handleUpdateValue("is_preorder", checked)
                  }
                >
                  {"สินค้า Pre-order"}
                </Checkbox>
              </WrapItem>
            </CustomCard>

            <CustomCard title={"รูปภาพสินค้า"}>
              <div className="flex justify-between pr-4 py-1">
                <h2 className="text-sm mb-2">{"รูปภาพหลัก 1 รูป"}</h2>
                <p
                  onClick={handleToggleDisplayUploadMainImageByURL}
                  className="text-sm flex items-center text-primary cursor-pointer duration-200 transition-all hover:opacity-60"
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
                    aria-label="product_main_image"
                    src={values.product_main_image || "/images/no-image.jpg"}
                    className={cn(
                      "h-[300px] mb-2 rounded-lg mx-auto",
                      values.product_main_image
                        ? "border border-slate-50"
                        : undefined
                    )}
                  />
                  <Input
                    label={"ลิงก์รูปภาพหลัก"}
                    value={values.product_main_image}
                    isRequired
                    name="product_main_image"
                    isInvalid={
                      isShowUploadMainImageUrl && !!err?.product_main_image?.[0]
                    }
                    errorMessage={
                      isShowUploadMainImageUrl && err?.product_main_image?.[0]
                    }
                    isReadOnly={!!values.product_main_image}
                    endContent={
                      <Button
                        isDisabled={!values.product_main_image}
                        isIconOnly
                        size="sm"
                        variant="light"
                        role="delete-main-image"
                        color={values.product_main_image ? "danger" : "default"}
                        onClick={() =>
                          setValues({ ...values, product_main_image: "" })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    }
                    onChange={({ target: { value } }) => {
                      const image = value.trim();
                      handleUpdateValue("product_main_image", image);
                    }}
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
                <ImageURLUpload
                  max={MAX_IMAGE_URL}
                  onChange={(product_images) => {
                    setValues({ ...values, product_images });
                  }}
                />
              </div>
            </CustomCard>

            <CustomCard title="หมวดหมู่สินค้า">
              <WrapItem>
                <SelectOption
                  isRequired
                  label={"หมวดหมู่สินค้า"}
                  name="category_name"
                  isInvalid={!!err?.category_name?.[0]}
                  errorMessage={err?.category_name?.[0]}
                  options={productCategories}
                  onSelectionChange={(value) =>
                    handleUpdateValue(
                      "category_name",
                      value.anchorKey as string
                    )
                  }
                />
              </WrapItem>
            </CustomCard>

            <CustomCard
              title="ราคาและส่วนลด"
              extra={
                <span
                  className="cursor-pointer text-sm text-primary hover:text-primary flex items-center"
                  onClick={handleToggleDisplayDiscount}
                  aria-label="show-discount-btn"
                >
                  {isShowDiscount
                    ? "ไม่ต้องการเพิ่มส่วนลด"
                    : "ต้องการเพิ่มส่วนลด"}
                </span>
              }
            >
              <WrapItem>
                <Input
                  label={"ราคา"}
                  isRequired
                  name="price"
                  isInvalid={!!err?.price?.[0]}
                  errorMessage={err?.price?.[0]}
                  value={values.price.toString()}
                  onChange={({ target: { value } }) =>
                    handleUpdateValue("price", value)
                  }
                />
                {isShowDiscount && (
                  <WrapItem>
                    <Input
                      label={"ส่วนลด (บาท)"}
                      name="discount_price"
                      value={values.discount_price?.toString()}
                      onChange={({ target: { value } }) =>
                        handleUpdateValue("discount_price", value)
                      }
                    />
                    <DateRangePicker
                      label={"ระยะเวลาส่วนลด"}
                      startName="discount_start_date"
                      endName="discount_end_date"
                      classNames={{ calendarContent: "bg-white" }}
                      onChange={({ start, end }) => {
                        const updatedDiscountDate: InsertProductState = {
                          ...values,
                          discount_start_date: start.toString(),
                          discount_end_date: end.toString(),
                        };

                        setValues(updatedDiscountDate);
                      }}
                    />
                  </WrapItem>
                )}
              </WrapItem>
            </CustomCard>

            <CustomCard title="คลังสินค้า">
              <Input
                label={"จำนวนสินค้าทั้งหมด"}
                isRequired
                name="stock_amount"
                isInvalid={!!err?.stock_amount?.[0]}
                errorMessage={err?.stock_amount?.[0]}
                value={values.stock_amount.toString()}
                onChange={({ target: { value } }) =>
                  handleUpdateValue("stock_amount", value)
                }
              />
            </CustomCard>

            <CustomCard title="การขนส่ง">
              <WrapItem>
                <RadioGroup
                  isRequired
                  label={"ผู้ให้บริการ"}
                  name="shipping_provider"
                  isInvalid={!!err?.shipping_provider?.[0]}
                  errorMessage={err?.shipping_provider?.[0]}
                  orientation="horizontal"
                  className="space-x-6"
                  value={values.shipping_provider}
                  onChange={({ target: { value } }) =>
                    handleUpdateValue("shipping_provider", value)
                  }
                >
                  {shippingProviders.map((item) => (
                    <Radio key={item.key} value={item.key}>
                      <div className="flex items-center space-x-2">
                        <img
                          src={item.image}
                          alt={`shipping-${item.key}`}
                          className="w-[32px] h-[32px] rounded-lg"
                        />
                        <label
                          className="text-sm"
                          aria-label="provider"
                          htmlFor={item.key}
                        >
                          {item.label}
                        </label>
                      </div>
                    </Radio>
                  ))}
                </RadioGroup>
                <Input
                  label={"ค่าจัดส่ง (บาท)"}
                  isRequired
                  name="shipping_fee"
                  isInvalid={!!err?.shipping_fee?.[0]}
                  errorMessage={err?.shipping_fee?.[0]}
                  value={values.shipping_fee?.toString()}
                  onChange={({ target: { value } }) =>
                    handleUpdateValue("shipping_fee", value)
                  }
                />
                <RadioGroup
                  isRequired
                  name="shipping_delivery_time"
                  isInvalid={!!err?.shipping_delivery_time?.[0]}
                  errorMessage={err?.shipping_delivery_time?.[0]}
                  label={"ระยะเวลาจัดส่ง"}
                  orientation="horizontal"
                  className="space-x-6"
                  value={values.shipping_delivery_time}
                  onChange={({ target: { value } }) =>
                    handleUpdateValue("shipping_delivery_time", value)
                  }
                >
                  {deliveryTime.map((item) => (
                    <Radio value={item.key} key={item.key}>
                      <label
                        htmlFor={item.key}
                        aria-label="delivery-days-time"
                        className="text-sm"
                      >
                        {item.label}
                      </label>
                    </Radio>
                  ))}
                </RadioGroup>
              </WrapItem>
            </CustomCard>
            <br className="my-4" />
            <div className="flex justify-center space-x-2">
              <Button
                color="primary"
                className="w-[120px]"
                role="insert"
                type="submit"
                isLoading={insertProduct.isPending}
              >
                {"สร้างสินค้า"}
              </Button>
              <Button variant="bordered" className="w-[120px]" role="clear">
                {"ยกเลิก"}
              </Button>
            </div>
          </div>
        </form>
      </ScrollShadow>
      <Modal />
    </div>
  );
}

function CustomCard({
  title,
  children,
  className,
  description,
  extra,
}: ICustomCard) {
  return (
    <Card shadow="none" className={cn("border border-slate-100", className)}>
      <CardHeader className="flex flex-col items-start">
        <div className="flex justify-between w-full items-center">
          <h2 className="text-md text-slate-800 font-medium">{title}</h2>
          {extra && extra}
        </div>
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

function WrapItem({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="flex flex-col space-y-3" aria-label="wrap-item">
      {children}
    </div>
  );
}
