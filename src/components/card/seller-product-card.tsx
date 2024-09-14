"use client";

import { priceFormatter } from "@/lib";
import type { Product } from "@/types";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
} from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

type SellerProductCardProps = Product;

export default function SellerProductCard({
  image = [],
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

  const hasMorethanOne = useMemo(() => image.length > 1, [image]);

  return (
    <Card radius="md" shadow="none" className="border z-0">
      <CardHeader className="relative">
        <Chip
          variant="dot"
          size="sm"
          className="absolute top-2 right-2 z-[1] text-foreground-600 text-[10px]"
          classNames={{ dot: sku ? "bg-green-500" : "bg-red-500" }}
        >
          {sku || "ยังไม่ได้อัพเดท SKU"}
        </Chip>
      </CardHeader>
      <CardBody className="flex justify-center place-items-center">
        <Carousel
          className="h-[200px] w-full"
          infinite={hasMorethanOne}
          swipeable={hasMorethanOne}
          arrows={hasMorethanOne}
          customLeftArrow={
            <Button
              radius="full"
              variant="light"
              className="left-1 absolute"
              isIconOnly
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          }
          customRightArrow={
            <Button
              radius="full"
              variant="light"
              className="right-1 absolute"
              isIconOnly
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          }
          responsive={{
            desktop: {
              breakpoint: { max: 3000, min: 1024 },
              items: 1,
              slidesToSlide: 1,
            },
            tablet: {
              breakpoint: { max: 1024, min: 464 },
              items: 1,
              slidesToSlide: 1,
            },
            mobile: {
              breakpoint: { max: 464, min: 0 },
              items: 1,
              slidesToSlide: 1,
            },
          }}
        >
          {image?.map((item, i) => (
            <Image
              src={item}
              key={`product-image-${i}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ))}
        </Carousel>
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
