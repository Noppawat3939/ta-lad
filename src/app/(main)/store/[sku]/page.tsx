"use client";

import { productService } from "@/apis";
import {
  ContentLayout,
  MainFooter,
  MainNavbar,
  ProductCardGroup,
} from "@/components";
import { dateFormatter, priceFormatter } from "@/lib";
import { Card, CardBody, Avatar, Tabs, Tab } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { PackageOpen, Store, UserRoundCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

type StoreBySkuPageProps = { params: { sku: string } };

export default function StoreBySkuPage({ params }: StoreBySkuPageProps) {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState<"all" | "new">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["product-list-store", params.sku],
    queryFn: () =>
      productService.getListProductBySKU(params.sku, {
        page: 1,
        page_size: 50,
      }),
    select: ({ data }) => ({
      ...data?.data,
      seller: {
        ...data?.data.seller,
        product_list_count: +priceFormatter(
          data?.data.seller.product_list_count
        ),
        products_soldout_count: +priceFormatter(
          data?.data.seller.products_soldout_count
        ),
        created_at: dateFormatter(data?.data.seller.created_at, "DD/MM/YYYY"),
      },
    }),
    enabled: !!params.sku,
  });

  const renderStoreInfo = () => {
    const storeInfo = [
      {
        label: "จำนวนสินค้าทั้งหมด",
        value: `${data?.seller.product_list_count || 0} ชิ้น`,
        icon: Store,
      },
      {
        label: "ขายไปแล้วทั้งหมด",
        value: `${data?.seller.products_soldout_count || 0} ชิ้น`,
        icon: PackageOpen,
      },
      {
        label: "เข้าร่วมเมื่อ",
        value: data?.seller.created_at,
        icon: UserRoundCheck,
      },
    ];

    return (
      <div className="grid grid-cols-2 gap-3 w-[80%] max-md:grid-cols-1 max-md:w-[95%]">
        {storeInfo.map((info, i) => (
          <div className="flex items-center space-x-1" key={`store-info-${i}`}>
            <info.icon className="w-4 h-4 text-[#FF731D]" />
            <label className="text-sm text-slate-800">{info.label}</label>
            <p className="text-[#FF731D] text-sm">{info.value}</p>
          </div>
        ))}
      </div>
    );
  };

  const goToDetail = (category: string, sku: string) =>
    router.push(`/product/${encodeURI(category)}/${sku}`);

  return (
    <section className="bg-slate-50 min-h-screen flex flex-col">
      <MainNavbar />
      <ContentLayout className="flex flex-col pt-4 space-y-4 pb-[60px]">
        <Card shadow="none" radius="sm">
          <CardBody>
            <div className="flex space-x-6 px-2 w-full">
              <Avatar
                className="max-w-[150px] w-full rounded-full object-cover h-[150px]"
                src={data?.seller.profile_image}
                classNames={{ img: "rounded-full p-1 bg-slate-50" }}
              />
              <div className="flex flex-col w-full">
                <h3
                  aria-label="store-name"
                  className="text-xl font-medium mb-2"
                >
                  {data?.seller.store_name}
                </h3>
                {renderStoreInfo()}
              </div>
            </div>
          </CardBody>
        </Card>
        <br />
        <Tabs
          variant="underlined"
          color="primary"
          isDisabled={isLoading}
          defaultSelectedKey={selectedTab}
          onSelectionChange={(selected) =>
            setSelectedTab(selected as typeof selectedTab)
          }
        >
          <Tab key={"all"} title={"สินค้าทั้งหมด"} />
          <Tab key={"new"} title={"สินค้าใหม่"} />
        </Tabs>
        <Suspense>
          <ProductCardGroup
            data={
              selectedTab === "all" ? data?.all_product : data?.new_arriaval
            }
            isLoading={isLoading}
            onClickProduct={(product) =>
              product?.category_name &&
              product?.sku &&
              goToDetail(product?.category_name, product?.sku)
            }
          />
        </Suspense>
      </ContentLayout>
      <MainFooter />
    </section>
  );
}
