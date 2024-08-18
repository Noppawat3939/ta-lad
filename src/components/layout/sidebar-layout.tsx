"use client";

import { type PropsWithChildren } from "react";
import { BussinessAside, ContentLayout } from "..";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
} from "@nextui-org/react";
import { ChevronDown, LogOut, User } from "lucide-react";

type SidebarLayoutProps = Readonly<PropsWithChildren> & {
  activeKey?: string;
  classNames?: { contentLayout?: string };
};

export default function SidebarLayout({
  children,
  activeKey,
  classNames,
}: SidebarLayoutProps) {
  return (
    <section role="sidebar-layout" className="flex-1 w-full h-screen">
      <div className="flex h-full">
        <div className="flex-1 max-w-[240px] h-full border-r-2 border-slate-50 z-10">
          <BussinessAside activeKey={activeKey} />
        </div>
        <div className="flex-1 h-full">
          <section
            role="top-bar"
            className="h-[70px] border-slate-50 flex shadow-sm bg-white justify-end top-0 sticky px-8 z-10"
          >
            <ProfileDropdown
              onSelect={(currentKey) => {
                console.log(currentKey);
              }}
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
}: {
  onSelect: (currentKey: string) => void;
}) {
  return (
    <Dropdown>
      <div className="flex items-center space-x-2">
        <Avatar name="Junior" />
        <div className="flex flex-col space-y-[-2px]">
          <h4 className="font-medium text-[15px]" aria-label="store-name">
            {"Store name"}
          </h4>
          <p className="text-gray-400/80 text-[12px]">{"example@gmail.com"}</p>
        </div>
        <DropdownTrigger>
          <Button size="sm" variant="light" isIconOnly>
            <ChevronDown className="text-slate-800 w-5 h-5" />
          </Button>
        </DropdownTrigger>
      </div>
      <DropdownMenu
        selectionMode="single"
        disallowEmptySelection
        color="primary"
        onSelectionChange={(e) => onSelect(String(e.currentKey))}
      >
        <DropdownItem key="profile" startContent={<User className="w-4 h-4" />}>
          {"Profile"}
        </DropdownItem>
        <DropdownItem
          key="logout"
          startContent={<LogOut className="w-4 h-4" />}
        >
          {"Logut"}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
