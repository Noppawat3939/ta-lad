import { Fragment, ReactNode, useMemo } from "react";
import { Button, cn } from "@nextui-org/react";
import { LucideProps, ShoppingCart, Tag } from "lucide-react";

type Menu = {
  key: string;
  label: ReactNode;
  icon?: LucideProps;
};

type BussinessAsideProps = {
  activeKey?: string;
  activeSubMenuKey?: string;
  injectSubMenu?: {
    key: string;
    children: {
      key: string;
      label: ReactNode;
      icon?: LucideProps;
    }[];
  };
};

export default function BussinessAside({
  activeKey,
  activeSubMenuKey,
  injectSubMenu,
}: BussinessAsideProps) {
  const defaultMenu = [
    {
      key: "products",
      label: "Products",
      icon: <Tag />,
    },
    { key: "orders", label: "Orders", icon: <ShoppingCart /> },
  ] as (Menu & { children?: Menu[] })[];

  const menus = useMemo(() => {
    if (injectSubMenu?.key && injectSubMenu.children) {
      return defaultMenu.map((m) =>
        m.key === injectSubMenu.key
          ? { ...m, children: injectSubMenu.children }
          : m
      );
    }

    return defaultMenu;
  }, [injectSubMenu]);

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
              className={cn(
                "text-start w-full",
                activeKey && activeKey === menu.key
                  ? "text-[#FF731D] font-medium"
                  : undefined
              )}
              startContent={
                menu.icon ? (
                  <Fragment>{menu.icon as ReactNode}</Fragment>
                ) : (
                  <Fragment />
                )
              }
            >
              <span aria-label={`menu-label-${menu.key}`} className="w-full">
                {menu.label}
              </span>
            </Button>

            {menu?.children?.map((subMenu) => (
              <div className="ml-[20px]" key={`sub-menu-${subMenu?.key}`}>
                <Button
                  variant="light"
                  className={cn(
                    "text-start w-full",
                    activeSubMenuKey && activeSubMenuKey === subMenu.key
                      ? "text-[#FF731D] font-medium"
                      : undefined
                  )}
                  startContent={
                    subMenu.icon ? (
                      <Fragment>{menu.icon as ReactNode}</Fragment>
                    ) : (
                      <Fragment />
                    )
                  }
                >
                  <span
                    aria-label={`menu-label-${subMenu?.key}`}
                    className={cn(
                      "w-full",
                      activeSubMenuKey && subMenu?.key === activeSubMenuKey
                        ? "text-[#FF731D] font-medium"
                        : "text-slate-900"
                    )}
                  >
                    {subMenu?.label}
                  </span>
                </Button>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
