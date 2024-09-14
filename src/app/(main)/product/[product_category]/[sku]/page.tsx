"use client";

import { productService } from "@/apis";
import {
  GetProductBySKU,
  GetProductsRelateBySKU,
} from "@/apis/internal/products";
import {
  Breadcrumb,
  ContentLayout,
  MainFooter,
  MainNavbar,
  ProductRelateCardGroup,
} from "@/components";
import { useCount, useMetadata } from "@/hooks";
import { priceFormatter } from "@/lib";
import {
  Button,
  ButtonProps,
  Card,
  CardBody,
  Image,
  cn,
} from "@nextui-org/react";
import { useQueries } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, PropsWithChildren, Suspense, useState } from "react";

type ProductDetailPageProps = {
  params: { product_category: string; sku: string };
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();

  const { count, onDecrease, onIncrease } = useCount(1);

  const [currentIndexImage, setCurrentIndexImage] = useState(0);

  const data = useQueries({
    queries: [
      {
        queryKey: ["product", params.sku],
        queryFn: () => productService.getProductBySKU(params.sku),
        enabled: !!params.sku,
        select: (res: GetProductBySKU) => res.data?.data,
      },
      {
        queryKey: ["products-relate", params.product_category],
        queryFn: () =>
          productService.getProductsRelateBySKU(params.sku, {
            page: 1,
            page_size: 20,
          }),
        enabled: !!params.sku,
        select: (res: GetProductsRelateBySKU) => res.data?.data,
      },
    ],
  });

  const product = data[0].data;
  const productsRelate = data[1].data;

  useMetadata({
    title: `${product?.product_name} | JUBPI จัดไป` || "JUBPI จัดไป",
  });

  const isLoading = data[0].isLoading || data[1].isLoading;

  return (
    <section className="bg-slate-50 min-h-screen flex flex-col">
      <MainNavbar />
      <ContentLayout className="py-t pb-20">
        <Breadcrumb
          items={[
            { key: "home", label: "หน้าแรก", href: "/" },
            {
              key: "product_category",
              label: decodeURI(params.product_category),
              href: `/product/${decodeURI(params.product_category)}`,
            },
            {
              key: "sku",
              label: params.sku,
              href: `/product/${encodeURI(params.product_category)}/${
                params.sku
              }`,
            },
          ]}
        />

        <section className="py-4" aria-label="product-detail">
          <Card shadow="none">
            <CardBody>
              <section className="flex space-x-4">
                <div className="flex-[.8] flex">
                  <div className="flex flex-col mr-2 space-y-2">
                    {product?.image?.map((image, i) => (
                      <Image
                        key={`image-${i}`}
                        alt="product-image"
                        radius="sm"
                        className={cn(
                          "object-contain border",
                          currentIndexImage === i
                            ? "border-[#FF731D] shadow-sm"
                            : "border-slate-50"
                        )}
                        loading="lazy"
                        src={image}
                        width={64}
                        onClick={() => setCurrentIndexImage(i)}
                      />
                    ))}
                  </div>
                  <Image
                    isLoading={isLoading}
                    loading="lazy"
                    height={400}
                    className="object-contain"
                    src={product?.image[currentIndexImage]}
                  />
                </div>
                <Show isTruely={product?.id !== undefined}>
                  <div className="flex-[1.2] px-2 flex flex-col gap-1">
                    <h3 className="text-2xl">{product?.product_name}</h3>
                    <p className="font-[300] text-sm text-foreground-500/80">{`รหัสสินค้า ${product?.sku}`}</p>
                    <h2 className="text-xl font-medium">
                      {priceFormatter(product?.price, true)}
                    </h2>
                    <Show isTruely={product?.stock_amount !== undefined}>
                      <span className="flex items-baseline space-x-1">
                        <p className="text-sm">
                          {product && product?.stock_amount > 0
                            ? `มีสินค้าอยู่ ${product!.stock_amount} ชิ้น`
                            : "สินค้าหมด"}
                        </p>
                        {product &&
                          product!.stock_amount < 10 &&
                          product!.stock_amount > 0 && (
                            <p className="text-xs text-red-500">
                              {"สินค้ามีจำนวนจำกัด"}
                            </p>
                          )}
                      </span>
                    </Show>
                    <CounterProduct
                      count={count}
                      onDecrease={onDecrease}
                      onIncrease={onIncrease}
                      isDisabledMax={
                        product?.stock_amount
                          ? count >= product?.stock_amount
                          : false
                      }
                      className="max-w-[100px]"
                    />
                    <Button color="primary" className="w-[180px] my-2">
                      <Plus className="w-4 h-4" />
                      {"หยิบใส่ตระกร้า"}
                    </Button>
                    <Show
                      isTruely={
                        product?.description !== undefined &&
                        !!product.description
                      }
                    >
                      <div className="text-sm">
                        <h5>{"รายละเอียดสินค้า"}</h5>
                        <p className="text-foreground-500/80 font-[300]">
                          {product?.description}
                        </p>
                      </div>
                    </Show>
                  </div>
                </Show>
              </section>
            </CardBody>
          </Card>
        </section>
        <section
          aria-label="products-relate"
          className="flex flex-col space-y-4"
        >
          <h3 className="font-medium">{"สินค้าที่เกี่ยวข้อง"}</h3>
          <Suspense>
            <ProductRelateCardGroup
              items={productsRelate}
              onClick={(data) =>
                router.push(
                  `/product/${encodeURI(data.category_name)}/${data.sku}`
                )
              }
            />
          </Suspense>
        </section>
      </ContentLayout>
      <MainFooter />
    </section>
  );
}

function Show({
  isTruely = false,
  children,
}: Readonly<PropsWithChildren & { isTruely?: boolean }>) {
  if (!isTruely) return;
  return <Fragment>{children}</Fragment>;
}

function CounterProduct({
  count,
  onDecrease,
  onIncrease,
  className,
  isDisabledMax,
}: {
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
  isDisabledMax?: boolean;
}) {
  const btnProps: ButtonProps = {
    isIconOnly: true,
    size: "sm",
    variant: "bordered",
  };

  return (
    <div className={cn("flex space-x-1 items-center", className)}>
      <Button isDisabled={count <= 1} {...btnProps} onClick={onDecrease}>
        <Minus className="w-4 h-4" />
      </Button>
      <span className="w-full text-center">{count}</span>
      <Button isDisabled={isDisabledMax} {...btnProps} onClick={onIncrease}>
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
