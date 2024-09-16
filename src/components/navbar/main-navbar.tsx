"use client";

import {
  Button,
  Image,
  Input,
  Kbd,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Search, ShoppingCart } from "lucide-react";
import { Fragment, useMemo } from "react";
import { SearchKeywordModal } from "..";
import { useSearchKeywordStore, useUserStore } from "@/stores";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { truncate } from "@/lib";
import { hasCookie } from "cookies-next";
import { useLogout } from "@/hooks";

type MainNavbarProps = {
  hideCardBtn?: boolean;
};

export default function MainNavbar({ hideCardBtn = false }: MainNavbarProps) {
  const { onOpen } = useSearchKeywordStore();
  const search = useSearchParams();

  const handleLogout = useLogout();

  const user = useUserStore((s) => s.user);

  const keywordSearch = search.get("k");

  const topNavLinks = useMemo(
    () => [
      { key: "login", href: "/login/seller-user", label: "ขายสินค้าที่นี่" },
      { key: "login", href: "/login/end-user", label: "ล็อคอิน" },
      { key: "login", href: "/registration/end-user", label: "สมัครสมาชิก" },
    ],
    []
  );

  const userMenus = useMemo(
    () => [
      { key: "profile", href: "/profile", label: "บัญชีของฉัน" },
      { key: "order", href: "/order", label: "รายการคำสั่งซื้อของฉัน" },
      {
        key: "signout",
        onClick: () => handleLogout(),
        label: "ออกจากระบบ",
      },
    ],
    [handleLogout]
  );

  return (
    <Fragment>
      <nav className="sticky top-0 bg-white w-full h-[100px] max-md:shadow-sm flex flex-col z-20">
        <div className="max-w-[1200px] w-full mx-auto max-xl:max-w-[1024px] max-lg:max-w-[768px] max-md:max-w-[95%] justify-end py-2 flex space-x-5 text-xs transition-all duration-200 text-foreground-500/70">
          {user?.id || hasCookie("rdtk") ? (
            <Popover placement="bottom" showArrow>
              <PopoverTrigger contextMenu={"hover"}>
                <span className="flex items-center space-x-2">
                  <Image
                    src={user?.profile_image}
                    width={20}
                    height={20}
                    loading="lazy"
                    className="rounded-full object-cover"
                    alt="profile"
                  />
                  <p>
                    {truncate(
                      `${user?.first_name || ""} ${user?.last_name || ""}`,
                      20
                    )}
                  </p>
                </span>
              </PopoverTrigger>
              <PopoverContent className="py-2 shadow-sm">
                <ul className="text-xs flex flex-col space-y-2">
                  {userMenus.map((menu) => (
                    <li key={`menu-${menu.key}`}>
                      <Link
                        className="hover:text-foreground-500/80 duration-200 transition-all"
                        href={menu.href || ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          menu?.onClick?.();
                        }}
                      >
                        {menu.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          ) : (
            topNavLinks.map((itemLink) => (
              <Link
                key={`top-link-${itemLink.key}`}
                href={itemLink.href as string}
                className="hover:text-foreground-500"
              >
                {itemLink.label}
              </Link>
            ))
          )}
        </div>
        <div
          aria-label="nav-wrapper"
          className="flex-1 py-1 h-full flex justify-center space-x-4 items-center"
        >
          <Link href={"/"} shallow={false}>
            <img
              src="/images/logo-second.png"
              className="h-[56px] w-[100px] object-cover"
            />
          </Link>
          <Input
            className="max-w-[1024px] max-xl:max-w-[768px] max-lg:max-w-[520px] max-md:hidden"
            classNames={{ input: "placeholder:text-gray-400" }}
            placeholder="ค้นหาด้วยชื่อสินค้า, หมวดหมู่ หรือ รหัสสินค้า"
            isReadOnly
            value={keywordSearch || ""}
            onClick={onOpen}
            startContent={<Search className="w-5 h-5 text-gray-500" />}
            endContent={
              <Kbd
                onClick={onOpen}
                className="text-gray-400"
                keys={["command"]}
              >
                K
              </Kbd>
            }
          />
          {!hideCardBtn && (
            <Button
              as={Link}
              href="/cart"
              aria-label="cart-link"
              color="primary"
              isIconOnly
              className="max-md:absolute max-md:right-4"
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          )}
        </div>
      </nav>
      <SearchKeywordModal />
    </Fragment>
  );
}
