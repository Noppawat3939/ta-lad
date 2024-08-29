import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  DateRangePicker,
  Input,
  Textarea,
  cn,
} from "@nextui-org/react";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { ImageUpload, SelectOption } from ".";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/apis";
import { InsertProduct } from "@/types";
import { dateFormatter, numberOnly } from "@/lib";

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
  sold_amount: undefined,
  discount_percent: undefined,
  discount_price: undefined,
  discount_start_date: undefined,
  discount_end_date: undefined,
};

export default function InsertProductForm() {
  const { data: categories, isFetching } = useQuery({
    queryKey: ["product-categories"],
    queryFn: productService.getCategoryList,
    select: ({ data }) => data?.data || [],
  });

  const [values, setValues] = useState<InsertProduct>(intialValues);

  const resetValues = useCallback(() => setValues(intialValues), []);

  const handleUpdateValue = useCallback(
    (key: keyof InsertProduct, value: number | string) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const categoryOptions = useMemo(
    () =>
      categories?.map((category) => ({
        key: category.name,
        value: category.name,
      })),
    [categories]
  );

  const handleCreateProduct = () => {
    console.log(values);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <CustomCard
          title={"ข้อมูลทั่วไป (General Information)"}
          className="flex-1"
        >
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
              onChange={({ target: { value } }) =>
                handleUpdateValue("description", value)
              }
            />
          </div>
        </CustomCard>

        <div className="flex flex-col space-y-3">
          <CustomCard title={"หมวดหมู่ (Product Category)"}>
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
          <CustomCard title={"คลังสินค้า (Inventory)"}>
            <Input
              label={"จำนวนคลัง (Stock amount)"}
              name="stock_amount"
              value={values.sold_amount?.toString()}
              onChange={({ target: { value } }) =>
                handleUpdateValue("sold_amount", numberOnly(value))
              }
            />
          </CustomCard>
        </div>

        <CustomCard
          title={"ราคาและส่วนลด (Price and Discount)"}
          className="flex-1"
        >
          <div className="flex flex-col space-y-3">
            <Input
              isRequired
              label={"ราคาสินค้า (Price)"}
              name="price"
              value={values.price.toString()}
              onChange={({ target: { value } }) =>
                handleUpdateValue("price", value)
              }
            />
            <Input
              className="flex-[.5]"
              label={"เปอร์เซ็นต์ส่วนลด (Discount Percentage) %"}
              value={values.discount_percent?.toString()}
              name="discount_percent"
              onChange={({ target: { value } }) =>
                handleUpdateValue("discount_percent", value)
              }
            />
            <div className="flex space-x-3">
              <DatePicker
                className="flex-[.5]"
                label={"วันที่เริ่มลด (Start date discount)"}
                name="discount_start_date"
              />
              <DatePicker
                className="flex-[.5]"
                label={"วันที่ลดราคาสุดท้าย (End date discount)"}
                name="discount_end_date"
              />
            </div>
          </div>
        </CustomCard>

        <CustomCard
          title={"รูปภาพสินค้า (Product Image)"}
          description={"อัพโหลดรูปมากที่สุดจำนวน 2 รูปภาพ"}
        >
          <ImageUpload max={2} />
        </CustomCard>
      </div>
      <div className="flex w-full p-4 space-x-2 justify-center">
        <Button
          role="insert"
          onClick={handleCreateProduct}
          isLoading={isFetching}
          className="w-[150px]"
          color="primary"
        >
          {"สร้างสินค้า"}
        </Button>
        <Button variant="bordered" className="w-[150px]" onClick={resetValues}>
          {"ยกเลิก"}
        </Button>
      </div>
    </div>
  );
}

function CustomCard({ title, children, className, description }: ICustomCard) {
  return (
    <Card shadow="none" className={cn("border border-slate-100", className)}>
      <CardHeader className="flex flex-col items-start">
        <h2 className="text-lg text-slate-800 font-medium">{title}</h2>
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
