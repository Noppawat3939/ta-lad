import { create } from "zustand";

type SearchKeyword = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const useSearchKeywordStore = create<SearchKeyword>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));

export default useSearchKeywordStore;
