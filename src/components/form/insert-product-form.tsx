import {
  Card,
  CardBody,
  CardHeader,
  DateRangePicker,
  Input,
  Textarea,
  cn,
} from "@nextui-org/react";
import { ReactNode } from "react";
import { ImageUpload, SelectOption } from ".";

interface ICustomCard {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export default function InsertProductForm() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <CustomCard
          title={"ข้อมูลทั่วไป (General Information)"}
          className="flex-1"
        >
          <div className="flex space-y-3 flex-col">
            <Input isRequired label={"ชื่อสินค้า"} />
            <Textarea label={"คำอธิบายสินค้า"} />
          </div>
        </CustomCard>

        <CustomCard title={"หมวดหมู่ (Product Category)"}>
          <SelectOption options={[{ key: "l", value: "val" }]} />
        </CustomCard>

        <CustomCard title={"ราคา (Price)"} className="flex-1">
          <div className="flex flex-col space-y-3">
            <Input isRequired label={"ราคาสินค้า (Price)"} />
            <div className="flex space-x-3">
              <Input
                className="flex-[.5]"
                label={"เปอร์เซ็นต์ส่วนลด (Discount Percentage) %"}
              />
              <DateRangePicker
                className="flex-[.5]"
                label={"วันที่เริ่ม - สิ้นสุด (Start to end date discount)"}
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
