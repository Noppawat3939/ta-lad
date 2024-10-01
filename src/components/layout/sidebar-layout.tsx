"use client";

import type { ReactNode, PropsWithChildren } from "react";
import { BussinessAside, ContentLayout } from "..";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
  User as NextUiUser,
} from "@nextui-org/react";
import { ChevronDown, LogOut, LucideProps, Store, User } from "lucide-react";
import type { User as UserType } from "@/types";
import { useUserStore } from "@/stores";
import { useLogout } from "@/hooks";

interface IInjectSubMenu {
  key: string;
  children: {
    key: string;
    label: ReactNode;
    icon?: LucideProps;
  }[];
}

interface IClassNames {
  contentLayout?: string;
  aside?: string;
}

type SidebarLayoutProps = Readonly<PropsWithChildren> & {
  activeKey?: string;
  activeSubMenuKey?: string;
  classNames?: IClassNames;
  injectSubMenu?: IInjectSubMenu;
};

export default function SidebarLayout({
  children,
  activeKey,
  classNames,
  injectSubMenu,
  activeSubMenuKey,
}: SidebarLayoutProps) {
  const user = useUserStore((s) => s.user);
  const handleLogout = useLogout();

  return (
    <section role="sidebar-layout" className="flex-1 w-full h-screen">
      <div className="flex h-full">
        <div
          className={cn(
            "flex-1 max-w-[240px] h-full border-r-2 border-slate-50 z-10 max-md:max-w-[200px] max-sm:hidden",
            classNames?.aside
          )}
        >
          <BussinessAside
            activeKey={activeKey}
            activeSubMenuKey={activeSubMenuKey}
            injectSubMenu={injectSubMenu}
          />
        </div>
        <div className="flex-1 h-full">
          <section
            role="top-bar"
            className="h-[70px] border-slate-50 flex shadow-sm bg-white justify-end top-0 sticky px-8 z-10"
          >
            <ProfileDropdown
              onSelect={(currentKey) => {
                if (currentKey === "logout") {
                  handleLogout();
                }
              }}
              user={user}
            />
          </section>
          <ContentLayout
            className={cn("h-[calc(100vh_-_70px)]", classNames?.contentLayout)}
          >
            {children}
          </ContentLayout>
        </div>
      </div>
    </section>
  );
}

function ProfileDropdown({
  onSelect,
  user,
}: {
  onSelect: (currentKey: string) => void;
  user: UserType | null;
}) {
  return (
    <Dropdown>
      <div className="flex items-center space-x-2">
        <div className="flex">
          <NextUiUser
            avatarProps={
              user?.profile_image
                ? {
                    src: user.profile_image,
                  }
                : undefined
            }
            name={user?.store_name}
            description={user?.email}
          />
          <DropdownTrigger>
            <Button size="sm" variant="light" isIconOnly>
              <ChevronDown className="text-slate-800 w-5 h-5" />
            </Button>
          </DropdownTrigger>
        </div>
      </div>
      <DropdownMenu
        selectionMode="single"
        disallowEmptySelection
        color="primary"
        onSelectionChange={(e) => onSelect(String(e.currentKey))}
      >
        <DropdownItem key="store" startContent={<Store className="w-4 h-4" />}>
          {"รายละเอียดร้านค้า"}
        </DropdownItem>
        <DropdownItem
          key="logout"
          startContent={<LogOut className="w-4 h-4" />}
        >
          {"ออกจากระบบ"}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
