"use client";

import { productService } from "@/apis";
import { CustomTable, ProductCard, SidebarLayout } from "@/components";
import { dateFormatter, isEmpty, priceFormatter, truncate } from "@/lib";
import { Button, Tab, Tabs } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { AlignJustify, LayoutGrid, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

export default function ProductsPage() {
  const pathname = usePathname();
  const { data, isFetching } = useQuery({
    queryFn: productService.getSellerProductList,
    queryKey: ["seller-product"],
    select: ({ data }) => data?.data || [],
  });

  const [viewProdcut, setViewProduct] = useState<"list" | "grid">("list");

  const products = useMemo(
    () =>
      isEmpty(data)
        ? []
        : data!.map((item) => ({
            key: item.id.toString(),
            product_name: truncate(item.product_name, 40),
            brand: item.brand,
            product_category: item.category_name,
            price: priceFormatter(item.price),
            stock: item.stock_amount,
            created_at: dateFormatter(item.created_at, "YYYY-MM-DD"),
          })),
    [data]
  );

  const renderTable = () => (
    <CustomTable
      isLoading={isFetching}
      classNames={{
        wrapper: "max-h-[calc(100vh_-_240px)]",
        tBodyRow: "odd:bg-[#ff741d15] rounded-sm",
      }}
      headerColumns={{
        product_name: { children: "Product name", order: 1 },
        brand: { children: "Brand", order: 2, width: 180 },
        product_category: {
          children: "Category",
          order: 3,
          width: 150,
        },
        price: { children: "Price", order: 4, width: 120 },
        stock: { children: "Stock", order: 5, width: 120 },
        created_at: { children: "Created date", order: 6, width: 150 },
      }}
      bodyColumns={products}
    />
  );

  const renderCards = () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        {data?.map((product) => (
          <ProductCard key={`product-${product.id}`} {...product} />
        ))}
      </div>
    );
  };

  return (
    <SidebarLayout
      activeKey="products"
      classNames={{ contentLayout: "px-4 py-3" }}
    >
      <section className="bg-white">
        <div className="flex justify-between py-3">
          <h1 className="text-2xl text-slate-900 font-semibold">
            {"Products"}
          </h1>

          <div className="flex space-x-4">
            <Tabs
              color="primary"
              defaultSelectedKey="list"
              onSelectionChange={(key) => {
                const selected = key as typeof viewProdcut;
                setViewProduct(selected);
              }}
            >
              <Tab title={<AlignJustify className="w-4 h-4" />} key="list" />
              <Tab title={<LayoutGrid className="w-4 h-4" />} key="grid" />
            </Tabs>
            <Button
              as={Link}
              href={`${pathname}/insert`}
              startContent={<Plus className="w-4 h-4" />}
              color="primary"
            >
              {"Add Product"}
            </Button>
          </div>
        </div>
        <section className="border-2 border-slate-50 p-3 rounded-lg">
          <Suspense>
            {viewProdcut === "list" && renderTable()}
            {viewProdcut === "grid" && renderCards()}
          </Suspense>
        </section>
      </section>
    </SidebarLayout>
  );
}
