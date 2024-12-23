"use client";

import { Fragment, Suspense, useTransition } from "react";
import {
  displayDiscountProduct,
  isEmpty,
  isNewRelaseProduct,
  priceFormatter,
} from "@/lib";
import type { Product } from "@/types";
import { Card, CardBody, CardFooter, Skeleton, cn } from "@nextui-org/react";
import { Box, Tag } from "lucide-react";

type ProductCardGroupProps = {
  data?: Product[];
  isLoading?: boolean;
  onClickToCart?: (sku: string) => void;
  onClickProduct?: (product?: Product) => void;
  classNames?: {
    container?: string;
  };
};

export default function ProductCardGroup({
  data,
  isLoading = false,
  onClickToCart,
  classNames,
  onClickProduct,
}: ProductCardGroupProps) {
  const [, startTransition] = useTransition();

  const products =
    !data?.length || isLoading
      ? (Array.from({ length: 100 }).fill({
          product_name: "",
          image: null,
        }) as unknown as typeof data)
      : data;

  if (!isLoading && isEmpty(data))
    return (
      <div className="flex space-x-2 items-center">
        <Box className="w-4 h-4 text-foreground-500/80" />
        <p>{"ไม่พบสินค้า"}</p>
      </div>
    );

  return (
    <Suspense>
      <section className={cn("w-full h-auto", classNames?.container)}>
        <div className="grid grid-cols-5 gap-4 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2">
          {products?.map((item, i) => {
            const showDiscount = displayDiscountProduct(
              item.discount_percent,
              item.discount_start_date,
              item.discount_end_date
            );
            const isSold = item.stock_amount === 0;
            const hasAlredySold = item.sold_amount > 0;
            const isNewProduct = isNewRelaseProduct(item.created_at);

            return (
              <Card
                key={i}
                isHoverable
                shadow="none"
                className="z-[1] rounded-md"
              >
                <CardBody
                  className="relative"
                  onClick={() => startTransition(() => onClickProduct?.(item))}
                >
                  {showDiscount && !isLoading && (
                    <span className="absolute top-2 right-2 flex px-1 z-[1] rounded-sm items-center space-x-1 bg-[#ff741ddb] text-white">
                      <Tag className="w-3 h-3" />
                      <small className="text-xs">{`-${item.discount_percent}%`}</small>
                    </span>
                  )}
                  {isNewProduct && item.product_name && (
                    <span className="absolute top-2 left-2 text-xs rounded-sm px-1 text-white bg-sky-400 z-[1]">
                      {"สินค้าใหม่"}
                    </span>
                  )}
                  <div className="flex justify-center mb-1">
                    {isLoading ? (
                      <Skeleton className="w-full h-[100px] rounded" />
                    ) : (
                      <img
                        src={item?.image?.[0]}
                        alt="product-image"
                        className="w-full flex flex-1 z-0 h-[120px] max-sm:h-[80px]"
                        loading="lazy"
                      />
                    )}
                  </div>
                  {isLoading || !item.product_name ? (
                    <Fragment>
                      <Skeleton className="w-full h-[10px] mt-1 rounded-sm" />
                      <Skeleton className="w-full h-[8px] mt-1 rounded-sm" />
                    </Fragment>
                  ) : (
                    <p className="text-[13px] max-sm:text-[11px] w-full text-center font-normal">
                      {item.product_name}
                    </p>
                  )}
                </CardBody>
                <CardFooter
                  className="pt-0 flex flex-col items-center"
                  onClick={() => startTransition(() => onClickProduct?.(item))}
                >
                  {isLoading ? (
                    <Skeleton className="w-full h-5 rounded-sm" />
                  ) : (
                    <Fragment>
                      <h3
                        className={cn(
                          "font-medium text-lg max-sm:text-medium",
                          showDiscount
                            ? "text-red-500"
                            : isSold
                            ? "text-gray-400/50"
                            : "text-black"
                        )}
                      >
                        {showDiscount ? (
                          <span className="text-xs font-[300] mr-1">
                            {"เหลือเพียง"}
                          </span>
                        ) : (
                          ""
                        )}
                        {priceFormatter(
                          showDiscount ? item.discount_price : item.price,
                          true
                        )}
                      </h3>
                      <div className="flex mb-2 items-center space-x-1 w-full justify-evenly font-[400]">
                        {hasAlredySold && (
                          <p className="text-[10px]">{`ขายไปแล้ว ${item.sold_amount} ชิ้น`}</p>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-sm",
                          isSold
                            ? "text-slate-400/80 font-[300]"
                            : "text-primary"
                        )}
                      >
                        {isSold ? "สินค้าหมด" : "มีสินค้าพร้อมส่ง"}
                      </p>
                    </Fragment>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>
    </Suspense>
  );
}
