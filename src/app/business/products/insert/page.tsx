import { InsertProductForm, SidebarLayout } from "@/components";
import { cn } from "@nextui-org/theme";
import { CheckCircle, Circle } from "lucide-react";

export default function InsertProductPage() {
  const checkInsertProductList = [
    {
      key: "general",
      label: "ข้อมูลทั่วไป ได้แก่ ชื่อ,แบรนด์ และคำอธิบายสินค้า",
      isCompleted: false,
    },
    {
      key: "image",
      label: "ข้อมูลรูปภาพ ได้แก่ รูปภาพหลัก และรูปภาพอื่นๆ",
      isCompleted: true,
    },
  ];

  return (
    <SidebarLayout
      classNames={{ contentLayout: "px-4 py-3" }}
      activeSubMenuKey="insert"
    >
      <section className="flex space-x-2">
        <div className="h-full flex flex-col space-y-4 flex-1 max-w-[768px] w-full">
          <header>
            <h1 className="text-2xl font-medium">{"สร้างสินค้าใหม่"}</h1>
          </header>
          <InsertProductForm />
        </div>

        <div className="flex flex-col p-3 flex-[.35]">
          <h3 className="font-medium">{"ตรวจสอบ"}</h3>
          <ul className="flex flex-col space-y-1 mt-2">
            {checkInsertProductList.map((list) => (
              <li
                key={list.key}
                className={cn(
                  "flex items-center text-sm",
                  list.isCompleted ? "text-slate-700" : "text-slate-700/50"
                )}
              >
                {list.isCompleted ? (
                  <CheckCircle className="w-3 h-3 mr-1 text-teal-500" />
                ) : (
                  <Circle className="w-3 h-3 mr-1" />
                )}
                {list.label}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SidebarLayout>
  );
}
