import { dateFormatter, priceFormatter } from "@/lib";
import type { Product } from "@/types";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@nextui-org/react";
import { ImageSlider } from "..";

type SellerProductCardProps = Product;

export default function SellerProductCard({
  image,
  product_name,
  description,
  price,
  brand,
  stock_amount,
  category_name,
  sku,
}: SellerProductCardProps) {
  const infos = [
    {
      key: "description",
      value: description,
      hide: !description,
    },
    {
      key: "price",
      value: (
        <Chip color="primary" size="sm">
          {priceFormatter(price, true)}
        </Chip>
      ),
    },
    { key: "brand", label: "แบรนด์", value: brand },
    { key: "category", label: "หมวดหมู่", value: category_name },
    { key: "stock", label: "สต็อก", value: `${stock_amount} ชิ้น` || "-" },
  ].filter((info) => !info.hide);

  return (
    <Card radius="md" shadow="none" className="border z-0">
      <CardHeader className="relative">
        <Chip
          variant="dot"
          size="sm"
          className="absolute top-2 right-2 z-[1] text-foreground-600 text-[10px]"
          classNames={{ dot: sku ? "bg-green-500" : "bg-red-500" }}
        >
          {sku || "Not update SKU"}
        </Chip>
      </CardHeader>
      <CardBody className="flex justify-center place-items-center">
        <ImageSlider images={image} height={200} />
      </CardBody>
      <CardFooter className="flex space-x-2 justify-between items-start">
        <div className="flex flex-col">
          <h3 className="text-[14px]">{product_name}</h3>
          {infos.map((info) => (
            <span
              className="flex items-baseline space-x-1 mb-1 text-xs text-gray-700/60"
              key={`info-${info.key}`}
            >
              {info?.label && (
                <label className="font-normal">{`${info.label}:`}</label>
              )}
              {info.key === "price" ? (
                info.value
              ) : (
                <p className="font-[300] text-foreground-500/50">
                  {info.value}
                </p>
              )}
            </span>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
