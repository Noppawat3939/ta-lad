"use client";

import { Button, Input, Kbd } from "@nextui-org/react";
import { Search, ShoppingCart } from "lucide-react";
import { Fragment } from "react";
import { SearchKeywordModal } from "..";
import { useSearchKeywordStore } from "@/stores";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type MainNavbarProps = {
  hideCardBtn?: boolean;
};

export default function MainNavbar({ hideCardBtn = false }: MainNavbarProps) {
  const { onOpen } = useSearchKeywordStore();
  const search = useSearchParams();

  const keywordSearch = search.get("k");

  return (
    <Fragment>
      <nav className="sticky top-0 bg-white w-full h-[100px] max-md:h-[64px] z-10">
        <div
          role="nav-wrapper"
          className="flex-1 h-full flex justify-center space-x-4 items-center"
        >
          <img
            src="/images/logo-second.png"
            className="h-[56px] w-[100px] object-cover"
          />
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
