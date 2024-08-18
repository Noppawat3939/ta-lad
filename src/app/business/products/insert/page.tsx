import { SidebarLayout } from "@/components";

export default function ProductInsertPage() {
  return (
    <SidebarLayout
      classNames={{ contentLayout: "px-4 py-3" }}
      activeSubMenuKey="insert"
      injectSubMenu={{
        key: "products",
        children: [
          {
            key: "insert",
            label: "Insert",
          },
        ],
      }}
    >
      ProductInsertPage
    </SidebarLayout>
  );
}
