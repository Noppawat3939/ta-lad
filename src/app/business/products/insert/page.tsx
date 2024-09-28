import { InsertProductForm, SidebarLayout } from "@/components";

export default function InsertProductPage() {
  return (
    <SidebarLayout
      classNames={{ contentLayout: "px-4 py-3" }}
      activeSubMenuKey="insert"
    >
      <section className="h-full flex flex-col space-y-4 max-w-[768px] mx-auto max-md:max-w-[520px] max-sm:max-w-[400px]">
        <header>
          <h1 className="text-2xl font-medium">{"สร้างสินค้าใหม่"}</h1>
        </header>
        <InsertProductForm />
      </section>
    </SidebarLayout>
  );
}
