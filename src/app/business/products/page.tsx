"use client";

import { CustomTable, SidebarLayout } from "@/components";
import { dateFormatter, priceFormatter } from "@/lib";

export default function ProductsPage() {
  return (
    <SidebarLayout
      activeKey="products"
      classNames={{ contentLayout: "px-4 py-3" }}
    >
      <section className="bg-white">
        <br />
        <section className="border-2 border-slate-50 p-3 rounded-lg">
          <CustomTable
            topContent={<>Products</>}
            classNames={{
              wrapper: "max-h-[calc(100vh_-_150px)]",
              tBodyRow: "odd:bg-[#ff741d20] rounded-sm",
            }}
            headerColumns={{
              product_name: { children: "Product name", order: 1 },
              product_category: { children: "Category", order: 2 },
              price: { children: "Price", order: 3 },
              stock: { children: "Stock", order: 4 },
              created_at: { children: "Created date", order: 5 },
            }}
            bodyColumns={Array(25).fill({
              key: "1",
              product_name: "Labubu",
              product_category: "toy",
              price: priceFormatter(550),
              stock: priceFormatter(99999),
              created_at: dateFormatter(Date.now(), "YYYY-MM-DD"),
            })}
          />
        </section>
      </section>
    </SidebarLayout>
  );
}
