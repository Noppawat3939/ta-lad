import { delay } from "@/lib";
import { useModalStore } from "@/stores";
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal as NextUIModal,
} from "@nextui-org/react";
import { Fragment } from "react";

export default function Modal() {
  const [modalState, setModalState] = useModalStore((s) => [
    s.modalState,
    s.setModalState,
  ]);

  const destroy = async () => {
    await delay();
    setModalState({ isOpen: false });
  };

  return (
    <NextUIModal
      isOpen={modalState.isOpen}
      onOpenChange={() => setModalState({ isOpen: false })}
    >
      <ModalContent>
        {() => (
          <Fragment>
            <ModalHeader className="font-medium">
              {modalState.title || "Header"}
            </ModalHeader>
            <ModalBody>{modalState.content || ""}</ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => {
                  modalState.onOk?.();
                  destroy();
                }}
              >
                {"OK"}
              </Button>
              <Button
                variant="bordered"
                onClick={() => {
                  modalState.onCancel?.();
                  destroy();
                }}
              >
                {"Cancel"}
              </Button>
            </ModalFooter>
          </Fragment>
        )}
      </ModalContent>
    </NextUIModal>
  );
}
