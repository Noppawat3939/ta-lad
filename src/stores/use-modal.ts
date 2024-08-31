import { ReactNode } from "react";
import { create } from "zustand";

interface State {
  isOpen: boolean;
  title?: ReactNode;
  content?: ReactNode;
  onOk?: <T>(atg?: T) => void;
  onCancel?: <T>(atg?: T) => void;
}

type ModalStore = {
  modalState: State;
  setModalState: (state: State) => void;
};

const useModalStore = create<ModalStore>((set) => ({
  modalState: {
    isOpen: false,
    title: "",
    content: "",
    onCancel: () => null,
    onOk: () => null,
  },
  setModalState: (updateState) =>
    set((state) => ({ modalState: { ...state, ...updateState } })),
}));

export default useModalStore;
