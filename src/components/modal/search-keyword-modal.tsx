"use client";

import { useSearchKeywordStore } from "@/stores";
import {
  Input,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useState, useTransition } from "react";

export default function SearchKeywordModal() {
  const { onClose, open } = useSearchKeywordStore();
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const [searchKeyword, setSearchKeyword] = useState("");

  const onSearch = () => {
    startTransition(() => {
      router.replace(
        `${pathname}${searchKeyword.trim() ? `?k=${searchKeyword}` : ""}`,
        { scroll: false }
      );
      onClose();
    });
  };

  return (
    <Modal
      isOpen={open}
      shadow="sm"
      onClose={onClose}
      placement="top"
      size="4xl"
    >
      <ModalContent>
        {() => (
          <Fragment>
            <ModalHeader>header</ModalHeader>
            <ModalBody className="p-4">
              <Input
                value={searchKeyword}
                isDisabled={isPending}
                onChange={({ target: { value } }) => setSearchKeyword(value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSearch();
                  }
                }}
                className="w-full max-w-[1024px] max-xl:max-w-[768px] max-lg:max-w-[520px] max-md:hidden"
                classNames={{
                  input: "placeholder:text-gray-400",
                }}
                placeholder={"ค้นหาด้วยชื่อสินค้า, หมวดหมู่ หรือ รหัสสินค้า"}
                endContent={<Kbd>{"Enter"}</Kbd>}
              />
            </ModalBody>
          </Fragment>
        )}
      </ModalContent>
    </Modal>
  );
}
