"use client";

import { displayDiscountProduct, priceFormatter } from "@/lib";
import { Product } from "@/types";
import { Card, CardBody } from "@nextui-org/react";
import { ProductCardLoader } from ".";
import { Tag } from "lucide-react";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

type ProductRelateCardGroupProps = {
  items?: Product[];
  onClick?: (item: Product) => void;
  isLoading?: boolean;
};

export default function ProductRelateCardGroup({
  items = [],
  onClick,
  isLoading = false,
}: ProductRelateCardGroupProps) {
  const hasProducts = !isLoading && items.length >= 1;
  const noProduct = !isLoading && items.length === 0;

  if (noProduct) {
    return (
      <div className="flex justify-center items-center min-h-[100px]">
        <p className="text-slate-500/80 font-[300]">{"ไม่พบสินค้า"}</p>
      </div>
    );
  }

  return (
    <Carousel
      infinite
      className="min-h-[300px] w-full"
      itemClass="flex"
      ssr
      draggable={false}
      responsive={{
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: items && items.length >= 5 ? 5 : 4,
          slidesToSlide: 3,
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 3,
          slidesToSlide: 2,
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 2,
          slidesToSlide: 1,
        },
      }}
    >
      {isLoading &&
        Array(10)
          .fill("")
          .map((_, i) => (
            <ProductCardLoader
              key={`product-loader-${i}`}
              classNames={{ card: "mx-2" }}
            />
          ))}

      {hasProducts &&
        items.map((item) => {
          const showDiscount = displayDiscountProduct(
            item.discount_percent,
            item.discount_start_date,
            item.discount_end_date
          );
          return (
            <Card
              key={`product-relate-${item?.id}`}
              shadow="none"
              radius="sm"
              className="w-full py-3 mx-2"
              isHoverable
            >
              <CardBody
                className="relative flex cursor-pointer justify-between items-center"
                onClick={() => onClick?.(item)}
              >
                {showDiscount && (
                  <span className="absolute top-1 right-2 flex px-1 z-[1] rounded-sm items-center space-x-1 bg-[#ff741ddb] text-white">
                    <Tag className="w-3 h-3" />
                    <small className="text-xs">{`-${item.discount_percent}%`}</small>
                  </span>
                )}
                <img
                  src={item.image?.[0]}
                  loading="lazy"
                  draggable={false}
                  className="h-[200px] w-full object-cover z-0"
                />
                <div className="flex flex-col items-center space-y-1">
                  <h3
                    aria-label="product-name"
                    className="text-[14px] text-slate-800 text-center"
                  >
                    {item.product_name}
                  </h3>
                  {showDiscount ? (
                    <div className="flex space-x-1 items-center">
                      <p
                        aria-label="product-price"
                        className="line-through text-xs font-[300] text-foreground-500/50"
                      >
                        {priceFormatter(item.price, true)}
                      </p>
                      <h2
                        aria-label="product-price"
                        className="text-red-500 font-medium text-lg"
                      >
                        {priceFormatter(item.discount_price, true)}
                      </h2>
                    </div>
                  ) : (
                    <h2
                      aria-label="produc-price"
                      className="font-medium text-lg"
                    >
                      {priceFormatter(item.price, true)}
                    </h2>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
    </Carousel>
  );
}
