"use client";

import { productService } from "@/apis";
import { GetProductBySKU } from "@/apis/internal/products";
import { Breadcrumb, ContentLayout, MainNavbar } from "@/components";
import { priceFormatter } from "@/lib";
import { Button, Card, CardBody, Image, cn } from "@nextui-org/react";
import { useQueries } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Fragment, PropsWithChildren, useState } from "react";

type ProductDetailPageProps = {
  params: { product_category: string; sku: string };
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [currentIndexImage, setCurrentIndexImage] = useState(0);

  const data = useQueries({
    queries: [
      {
        queryKey: ["product"],
        queryFn: () => productService.getProductBySKU(params.sku),
        enabled: !!params.sku,
        select: (res: GetProductBySKU) => res.data?.data,
      },
    ],
  });

  const product = data[0].data;

  const isLoading = data[0].isLoading;

  return (
    <section className="bg-slate-50 min-h-screen flex flex-col">
      <MainNavbar />
      <ContentLayout className="py-6">
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

        <section className="py-4">
          <Card shadow="none" className="border-2 border-slate-100">
            <CardBody>
              <section className="flex space-x-4">
                <div className="flex-1 flex">
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
                  <div className="border-2 border-blue-500 flex-1">
                    <h3 className="text-2xl">{product?.product_name}</h3>
                    <p className="font-[300] text-sm text-foreground-500/80">{`รหัสสินค้า ${product?.sku}`}</p>
                    <h2 className="text-xl">
                      {priceFormatter(product?.price, true)}
                    </h2>
                    <p>
                      {product!?.stock_amount > 0
                        ? `มีสินค้าอยู่ ${product?.stock_amount} ชิ้น`
                        : "สินค้าหมด"}
                    </p>
                    <Button color="primary">
                      <Plus className="w-4 h-4" />
                      {"หยิบใส่ตระกร้า"}
                    </Button>
                    <div className="text-sm">
                      <h5>{"รายละเอียดสินค้า"}</h5>
                      <p className="text-foreground-500/80 font-[300]">
                        {product?.description || "-"}
                      </p>
                    </div>
                  </div>
                </Show>
              </section>
            </CardBody>
          </Card>
        </section>
        <section>
          <h3 className="font-medium">{"สินค้าที่เกี่ยวข้อง"}</h3>
        </section>
      </ContentLayout>
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
