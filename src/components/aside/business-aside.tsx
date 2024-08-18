import { useMemo } from "react";
import { Button, cn } from "@nextui-org/react";
import { ShoppingCart, Tag } from "lucide-react";

type BussinessAsideProps = { activeKey?: string };

export default function BussinessAside({ activeKey }: BussinessAsideProps) {
  const menus = useMemo(
    () => [
      { key: "products", label: "Products", icon: Tag },
      { key: "orders", label: "Orders", icon: ShoppingCart },
    ],
    []
  );

  return (
    <div className="w-full bg-white sticky top-0 left-0">
      <section className="flex items-center px-4 h-[100px]">
        <div className="flex items-center space-x-2">
          <img
            className="w-[72px] object-cover"
            src="/images/logo-primary.png"
          />
          <h1 className="text-4xl text-slate-900 font-semibold">{"JUDPI"}</h1>
        </div>
      </section>
      <section className="flex px-3 py-4 flex-col space-y-1">
        {menus.map((menu) => (
          <div key={menu.key}>
            <Button
              variant="light"
              className="text-start"
              fullWidth
              startContent={
                menu.icon ? (
                  <menu.icon
                    className={cn(
                      "w-4 h-4",
                      activeKey && menu.key === activeKey
                        ? "text-[#FF731D]"
                        : "text-slate-900"
                    )}
                  />
                ) : undefined
              }
            >
              <span
                aria-label={`menu-label-${menu.key}`}
                className={cn(
                  "w-full",
                  activeKey && menu.key === activeKey
                    ? "text-[#FF731D] font-medium"
                    : "text-slate-900"
                )}
              >
                {menu.label}
              </span>
            </Button>
          </div>
        ))}
      </section>
    </div>
  );
}
