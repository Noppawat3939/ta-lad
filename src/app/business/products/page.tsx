"use client";

import { CustomTable, SidebarLayout } from "@/components";
import { dateFormatter, priceFormatter } from "@/lib";
import { Button } from "@nextui-org/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export default function ProductsPage() {
  const pathname = usePathname();

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
          <Button
            as={Link}
            href={`${pathname}/insert`}
            startContent={<Plus className="w-4 h-4" />}
            color="primary"
          >
            {"Add Product"}
          </Button>
        </div>
        <section className="border-2 border-slate-50 p-3 rounded-lg">
          <Suspense>
            <CustomTable
              classNames={{
                wrapper: "max-h-[calc(100vh_-_240px)]",
                tBodyRow: "odd:bg-[#ff741d15] rounded-sm",
              }}
              headerColumns={{
                product_name: { children: "Product name", order: 1 },
                product_category: { children: "Category", order: 2 },
                price: { children: "Price", order: 3, width: 150 },
                stock: { children: "Stock", order: 4, width: 150 },
                created_at: { children: "Created date", order: 5, width: 200 },
              }}
              bodyColumns={Array(25).fill({
                key: "1",
                product_name: "Labubu",
                product_category: "toy",
                price: priceFormatter(550),
                stock: priceFormatter(12500),
                created_at: dateFormatter(Date.now(), "YYYY-MM-DD"),
              })}
            />
          </Suspense>
        </section>
      </section>
    </SidebarLayout>
  );
}
