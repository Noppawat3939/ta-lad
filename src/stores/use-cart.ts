import { ProductCart } from "@/types";
import { create } from "zustand";

type UseCartStore = {
  carts: ProductCart[];
  count: number;
  setCarts: (newCart: ProductCart[]) => void;
};

const useCartStore = create<UseCartStore>((set, get) => ({
  carts: [],
  count: get()?.carts?.length ?? 0,
  setCarts: (newCart) => set({ carts: newCart }),
}));

export default useCartStore;
