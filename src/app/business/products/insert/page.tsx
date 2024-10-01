"use client";

import { InsertProductForm, SidebarLayout } from "@/components";
import { useInsertProductStore } from "@/stores";
import { cn } from "@nextui-org/theme";
import { CheckCircle, Circle } from "lucide-react";
import { useMemo } from "react";

export default function InsertProductPage() {
  const values = useInsertProductStore((s) => s.values);

  const checkInsertProductList = useMemo(
    () => [
      {
        key: "general",
        label: "ข้อมูลทั่วไป",
        isCompleted: [values.product_name, values.brand].every((val) => !!val),
      },
      {
        key: "image",
        label: "ข้อมูลรูปภาพ",
        isCompleted: !!values.product_main_image,
      },
      {
        key: "category",
        label: "หมวดหมู่สินค้า",
        isCompleted: !!values.category_name,
      },
      {
        key: "price_discount",
        label: "ราคาและส่วนลด",
        isCompleted: !!values.price,
      },
      {
        key: "inventory",
        label: "คลังสินค้า",
        isCompleted: !!values.stock_amount,
      },
      {
        key: "shipping",
        label: "การขนส่ง",
        isCompleted: [
          values.shipping_provider,
          values.shipping_fee,
          values.shipping_delivery_time,
        ].every((val) => !!val),
      },
    ],
    [values]
  );

  return (
    <SidebarLayout
      classNames={{ contentLayout: "px-4 py-3", aside: "max-lg:hidden" }}
      activeSubMenuKey="insert"
    >
      <section className="flex space-x-2">
        <div className="h-full flex flex-col space-y-4 flex-1 max-w-[768px] w-full">
          <header>
            <h1 className="text-2xl font-medium">{"สร้างสินค้าใหม่"}</h1>
          </header>
          <InsertProductForm />
        </div>

        <div className="flex flex-col p-3 flex-[.35] max-md:flex-[.3]">
          <h3 className="font-medium">{"ตรวจสอบข้อมูลการสร้างสินค้า"}</h3>
          <ul className="flex flex-col space-y-1 mt-2">
            {checkInsertProductList.map(({ key, isCompleted, label }) => (
              <li
                key={key}
                className={cn(
                  "flex items-center text-sm",
                  isCompleted ? "text-slate-700" : "text-slate-700/50"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-3 h-3 mr-1 text-teal-500" />
                ) : (
                  <Circle className="w-3 h-3 mr-1" />
                )}
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SidebarLayout>
  );
}
