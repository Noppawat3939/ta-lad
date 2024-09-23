"use client";

import { Product } from "@/types";
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Fragment, useState } from "react";

type GroupProductsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  products: Pick<Product, "id" | "image">[];
  onGroup: ({
    name,
    product_ids,
  }: {
    name: string;
    product_ids: number[];
  }) => void;
};

export default function GroupProductsModal({
  isOpen,
  onClose,
  products,
  onGroup,
}: GroupProductsModalProps) {
  const [groupName, setGroupName] = useState("");

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {() => (
          <Fragment>
            <ModalHeader className="font-medium">
              {"รวมกลุ่ม/ยกเลิกรวมกลุ่ม สินค้า"}
            </ModalHeader>
            <ModalBody className="flex flex-col space-y-2">
              <Input
                value={groupName}
                onChange={({ target: { value } }) => setGroupName(value)}
                isRequired
                size="sm"
                label={"ประเภทกลุ่ม"}
                placeholder={"สี/ขนาด/ประเภท เป็นต้น"}
              />
              <div className="flex space-x-1 justify-evenly">
                {products.map((product) => (
                  <div key={product.id}>
                    <Image
                      alt="product-image"
                      src={product.image[0]}
                      loading="lazy"
                      className="w-[72px] h-[72px] object-cover"
                    />
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                isDisabled={!groupName.trim()}
                aria-label="group-btn"
                onClick={() =>
                  onGroup({
                    name: groupName,
                    product_ids: products.map(({ id }) => id),
                  })
                }
                color="primary"
              >
                {"รวมกลุ่ม"}
              </Button>
              <Button isDisabled>{"ยกเลิกรวมกลุ่ม"}</Button>
            </ModalFooter>
          </Fragment>
        )}
      </ModalContent>
    </Modal>
  );
}