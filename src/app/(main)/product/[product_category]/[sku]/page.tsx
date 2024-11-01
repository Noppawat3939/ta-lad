"use client";

import { productService } from "@/apis";
import {
  type GetProductBySKU,
  type GetProductsRelateBySKU,
} from "@/apis/internal/products";
import {
  Breadcrumb,
  ContentLayout,
  MainFooter,
  Modal,
  ProductRelateCardGroup,
} from "@/components";
import { useCount, useMetadata } from "@/hooks";
import { dateFormatter, isUndefined, priceFormatter } from "@/lib";
import { AuthProvider } from "@/provider";
import { useModalStore, useUserStore } from "@/stores";
import { Product } from "@/types";
import {
  Button,
  ButtonProps,
  Card,
  CardBody,
  Image,
  Spinner,
  User,
  cn,
} from "@nextui-org/react";
import { useQueries } from "@tanstack/react-query";
import { CircleCheck, Minus, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Fragment, type PropsWithChildren, Suspense, useState } from "react";

const MainNavbar = dynamic(() => import("@/components/navbar/main-navbar"), {
  ssr: false,
});

type ProductDetailPageProps = {
  params: { product_category: string; sku: string };
};

export default function ProductDetailPage({
  params,
  ...rest
}: ProductDetailPageProps) {
  const router = useRouter();

  const { count, onDecrease, onIncrease, onReset } = useCount(1);

  const [currentIndexImage, setCurrentIndexImage] = useState(0);
  const [selectedGroupProductItem, setSelectGroupProductItem] =
    useState<Product | null>(null);

  const { setModalState } = useModalStore();

  const user = useUserStore((s) => s.user);

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
  const isLoadingProductsRelate = data[1].isFetching;

  useMetadata({
    title: `${product?.product_name || ""} JUBPI จัดไป` || "JUBPI จัดไป",
  });

  const goToStore = (sku: string) => router.push(`/store/${sku}`);

  const handleAddToCart = () => {
    if (!user?.id) {
      setModalState({
        isOpen: true,
        title: "คุณต้องการเพิ่มสินค้าใช่ไหม?",
        content: "จำเป็นต้องล็อกอินเข้าสู่ระบบ",
        onOk: () => {
          const callbackParams = `product/${decodeURI(
            params.product_category
          )}/${params.sku}`;

          router.replace(
            `/login/end-user?callback=${encodeURIComponent(callbackParams)}`
          );
        },
      });
    } else {
      console.log("insert !", { count, product_id: product?.id });
    }
  };

  const isLoading = [data[0].isLoading, data[1].isLoading].some(Boolean);

  const isError = [data[0].isError, data[1].isError].some(Boolean);

  return (
    <AuthProvider>
      <section className="bg-slate-50 min-h-screen flex flex-col">
        <MainNavbar />
        <ContentLayout className="py-t pb-20">
          <Breadcrumb
            props={{ base: { className: "pt-2" } }}
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
                <Show isTruely={isLoading}>
                  <div className="min-h-[320px] flex flex-1 justify-center">
                    <Spinner />
                  </div>
                </Show>
                <Show isTruely={!isError && !isLoading}>
                  <section className="flex space-x-4 py-2">
                    <div aria-label="product-images" className="flex-[.9] flex">
                      <div className="flex flex-col mr-2 space-y-2">
                        {(
                          selectedGroupProductItem?.image || product?.image
                        )?.map((image, i) => (
                          <Image
                            key={`image-${i}`}
                            alt="product-image"
                            radius="sm"
                            className={cn(
                              "object-cover border-2 min-w-[64px] w-full h-[64px]",
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
                        radius="none"
                        className="object-contain h-[400px] w-[300px]"
                        src={
                          (selectedGroupProductItem || product)?.image[
                            currentIndexImage
                          ]
                        }
                      />
                    </div>
                    <Show isTruely={product?.id !== undefined}>
                      <div className="flex-[1.2] px-2 flex flex-col gap-1">
                        <h3 className="text-2xl h-[80px]">
                          {(selectedGroupProductItem || product)?.product_name}
                        </h3>
                        <User
                          className="justify-start w-fit my-1 cursor-pointer"
                          name={product?.seller?.store_name || ""}
                          onClick={() =>
                            goToStore(
                              (selectedGroupProductItem || product)?.sku || ""
                            )
                          }
                          avatarProps={{
                            src: product?.seller?.profile_image,
                          }}
                          description={
                            <div>
                              <p aria-label="product_list_count">
                                {`จำนวนรายการสินค้าทั้งหมด ${priceFormatter(
                                  product?.seller?.product_list_count
                                )} ชิ้น`}
                              </p>
                              <p>{`เข้าร่วมเมื่อ ${dateFormatter(
                                product?.seller?.created_at,
                                "DD/MM/YYYY"
                              )}`}</p>
                            </div>
                          }
                        />
                        <h2 className="text-2xl font-medium">
                          {priceFormatter(
                            (selectedGroupProductItem || product)?.price,
                            true
                          )}
                        </h2>
                        <Show
                          isTruely={
                            product?.group_products?.products &&
                            product?.group_products?.products.length > 0
                          }
                        >
                          <section className="flex items-start space-x-5">
                            <label htmlFor="group-product-name">
                              {product?.group_products?.name}
                            </label>
                            <div
                              className={cn(
                                "grid my-2 gap-4 w-fit",
                                product?.group_products?.products &&
                                  product?.group_products?.products.length > 5
                                  ? "grid-cols-5"
                                  : "grid-cols-4"
                              )}
                            >
                              {product?.group_products?.products?.map(
                                (groupItem) => (
                                  <div
                                    key={`group-product-${groupItem.id}`}
                                    className={cn(
                                      "cursor-pointer",
                                      selectedGroupProductItem &&
                                        selectedGroupProductItem.id ===
                                          groupItem.id
                                        ? "opacity-100"
                                        : "opacity-60"
                                    )}
                                    onClick={() => {
                                      if (currentIndexImage !== 0) {
                                        setCurrentIndexImage(0);
                                      }
                                      if (count !== 0) {
                                        onReset();
                                      }

                                      setSelectGroupProductItem(groupItem);
                                    }}
                                  >
                                    <Image
                                      alt="group-product"
                                      src={groupItem.image[0]}
                                      radius="sm"
                                      className="w-[48px] h-[48px] object-cover"
                                      loading="lazy"
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </section>
                        </Show>
                        <Show isTruely={product?.stock_amount !== undefined}>
                          <span className="flex items-baseline space-x-1">
                            <p className="text-sm">
                              {product && product?.stock_amount > 0
                                ? `มีสินค้าอยู่ ${priceFormatter(
                                    selectedGroupProductItem?.stock_amount ||
                                      product!.stock_amount
                                  )} ชิ้น`
                                : "สินค้าหมด"}
                            </p>
                          </span>
                        </Show>

                        <CounterProduct
                          count={count}
                          onDecrease={onDecrease}
                          onIncrease={onIncrease}
                          isDisabledMax={
                            (selectedGroupProductItem &&
                              selectedGroupProductItem?.stock_amount) ||
                            product?.stock_amount
                              ? count >=
                                Number(
                                  selectedGroupProductItem?.stock_amount ||
                                    product?.stock_amount
                                )
                              : false
                          }
                          className="max-w-[100px]"
                        />

                        <Show
                          isTruely={!isUndefined(product?.product_shipping?.id)}
                        >
                          <div className="flex flex-col space-y-1 mt-3">
                            <h3>{"การจัดส่ง"}</h3>
                            <ul className="text-sm font-[300]">
                              <li className="flex items-center">
                                <CircleCheck className="w-3 h-3 mr-1 text-primary" />
                                {`ผู้ให้บริการขนส่ง ${product?.product_shipping?.provider}`}
                              </li>
                              <li className="flex items-center">
                                <CircleCheck className="w-3 h-3 mr-1 text-primary" />
                                {`ระยะเวลาจัดส่งโดยประมาณ ${product?.product_shipping?.delivery_time} วัน`}
                              </li>
                            </ul>
                          </div>
                        </Show>

                        <Button
                          color="primary"
                          className="w-[180px] my-4"
                          aria-label="add-to-cart"
                          onClick={handleAddToCart}
                        >
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
                </Show>
                <Show isTruely={isError}>
                  <div className="min-h-[320px] flex flex-1 items-center justify-center">
                    <p>{"ไม่พบสินค้า"}</p>
                  </div>
                </Show>
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
                isLoading={isLoadingProductsRelate}
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
        <Modal />
      </section>
    </AuthProvider>
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
