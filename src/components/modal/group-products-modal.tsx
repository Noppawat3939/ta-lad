"use client";

import { Product } from "@/types";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Fragment, useCallback, useEffect, useState } from "react";

type GroupProductsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  products: Pick<Product, "id" | "image">[];
  groupName?: string;
  onGroup: ({
    name,
    product_ids,
  }: {
    name: string;
    product_ids: number[];
  }) => void;
  onUnGroup: () => void;
};

export default function GroupProductsModal({
  isOpen,
  onClose,
  products,
  onGroup,
  groupName: name,
  onUnGroup,
}: GroupProductsModalProps) {
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (isOpen && name) {
      setGroupName(name);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setGroupName("");
    onClose();
  }, []);

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose}>
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
              <div className="grid grid-cols-5 gap-2">
                {products.map((product) => (
                  <div key={product.id}>
                    <img
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
                isDisabled={name ? true : !groupName.trim()}
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
              <Button
                onClick={onUnGroup}
                aria-label="un-group-btn"
                isDisabled={!name}
              >
                {"ยกเลิกรวมกลุ่ม"}
              </Button>
            </ModalFooter>
          </Fragment>
        )}
      </ModalContent>
    </Modal>
  );
}
