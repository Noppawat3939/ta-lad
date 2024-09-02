import { dateFormatter, priceFormatter } from "@/lib";
import type { Product } from "@/types";
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { ImageSlider } from "..";

type ProductCardProps = Product;

export default function ProductCard({
  image,
  product_name,
  description,
  price,
  brand,
  stock_amount,
  category_name,
  created_at,
}: ProductCardProps) {
  const infos = [
    {
      key: "description",
      label: "Description",
      value: description,
      hide: !description,
    },
    { key: "brand", label: "Brand", value: brand },
    { key: "category", label: "Category", value: category_name },
    { key: "stock", label: "Stock", value: stock_amount || "-" },
    {
      key: "created_at",
      label: "Created date",
      value: dateFormatter(created_at, "YYYY-MM-DD"),
    },
  ].filter((info) => !info.hide);

  return (
    <Card radius="md" shadow="none" className="border z-0">
      <CardBody className="flex justify-center place-items-center">
        <ImageSlider images={image} />
      </CardBody>
      <CardFooter className="flex space-x-2 justify-between items-start">
        <div className="flex flex-col">
          <h3 className="text-[14px]">{product_name}</h3>
          {infos.map((info) => (
            <span
              className="flex items-baseline space-x-1 text-xs text-gray-700/60"
              key={`info-${info.key}`}
            >
              <label className="font-normal">{`${info.label}:`}</label>
              <p className="font-[300]">{info.value}</p>
            </span>
          ))}
        </div>
        <Button size="sm" color="primary">
          {priceFormatter(price, true)}
        </Button>
      </CardFooter>
    </Card>
  );
}
