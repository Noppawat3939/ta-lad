"use client";

import {
  Button,
  Image,
  Input,
  Kbd,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@nextui-org/react";
import {
  LogOut,
  Search,
  ShoppingCart,
  ShoppingCartIcon,
  Tag,
  User,
} from "lucide-react";
import { Fragment, useMemo } from "react";
import { SearchKeywordModal } from "..";
import { useCartStore, useSearchKeywordStore, useUserStore } from "@/stores";
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

  const { carts } = useCartStore();

  const keywordSearch = search.get("k");

  const topNavLinks = useMemo(
    () => [
      {
        key: "login_seller_user",
        href: "/login/seller-user",
        label: "ขายสินค้าที่นี่",
      },
      { key: "login_end_user", href: "/login/end-user", label: "ล็อคอิน" },
      {
        key: "register_end_user",
        href: "/registration/end-user",
        label: "สมัครสมาชิก",
      },
    ],
    []
  );

  const userMenus = useMemo(
    () =>
      user?.store_name
        ? [
            {
              key: "product",
              href: "/business/products",
              label: "สินค้าทั้งหมด",
              icon: Tag,
            },
            {
              key: "profile",
              href: "/profile",
              label: "บัญชีของฉัน",
              icon: User,
            },
            {
              key: "signout",
              onClick: () => handleLogout(),
              label: "ออกจากระบบ",
              icon: LogOut,
            },
          ]
        : [
            {
              key: "order",
              href: "/order",
              label: "รายการคำสั่งซื้อของฉัน",
              icon: ShoppingCartIcon,
            },
            {
              key: "profile",
              href: "/profile",
              label: "บัญชีของฉัน",
              icon: User,
            },
            {
              key: "signout",
              onClick: () => handleLogout(),
              label: "ออกจากระบบ",
              icon: LogOut,
            },
          ],
    [handleLogout, user]
  );

  const profile = useMemo(() => {
    if (user?.profile_image) return user?.profile_image;
    if (user?.store_name) return "/images/seller.png";
    return "/images/user.png";
  }, [user]);

  const hasCart = useMemo(() => carts.length > 0, [carts]);

  return (
    <Fragment>
      <nav className="sticky top-0 bg-white w-full h-[100px] max-md:shadow-sm flex flex-col z-20">
        <div className="max-w-[1200px] w-full mx-auto max-xl:max-w-[1024px] max-lg:max-w-[768px] max-md:max-w-[95%] justify-end items-center py-2 flex space-x-5 text-xs transition-all duration-200 text-foreground-500/70">
          {user?.role === "user" && (
            <p className="hidden max-md:relative max-md:py-1">
              <ShoppingCart
                className={cn(
                  "w-4 h-4",
                  hasCart ? "text-slate-500" : "text-slate-400/50"
                )}
              />
              {hasCart && (
                <sub className="absolute -top-[4px] -right-[8px] bg-red-600 text-white shadow rounded-full flex justify-center font-medium items-center w-[18px] h-[18px]">
                  {carts.length}
                </sub>
              )}
            </p>
          )}
          {user?.id || hasCookie("rdtk" || "srdtk") ? (
            <Popover placement="bottom" showArrow>
              <PopoverTrigger contextMenu={"hover"}>
                <span className="flex items-center space-x-2">
                  <Image
                    src={profile}
                    width={20}
                    height={20}
                    loading="lazy"
                    className="rounded-full object-cover"
                    alt="profile"
                  />
                  <p className="max-sm:hidden">
                    {truncate(
                      `${user?.first_name || ""} ${user?.last_name || ""} ${
                        user?.store_name || ""
                      }`,
                      20
                    )}
                  </p>
                </span>
              </PopoverTrigger>
              <PopoverContent className="py-2 shadow-sm">
                <ul className="text-xs flex flex-col space-y-2">
                  {userMenus.map((menu) => (
                    <li
                      key={`menu-${menu.key}`}
                      className="py-1 flex items-center space-x-2 px-2"
                    >
                      <menu.icon className="w-4 h-4" />
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
          {!(hideCardBtn || user?.role === "store") && (
            <div className="relative max-md:hidden">
              <Button
                as={Link}
                href="/cart"
                aria-label="cart-link"
                color={hasCart ? "default" : "primary"}
                isIconOnly
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
              {hasCart && (
                <sub className="absolute -top-[2px] -right-[2px] bg-primary text-white shadow rounded-full flex justify-center font-medium items-center w-[20px] h-[20px]">
                  {carts.length}
                </sub>
              )}
            </div>
          )}
        </div>
      </nav>
      <SearchKeywordModal />
    </Fragment>
  );
}
