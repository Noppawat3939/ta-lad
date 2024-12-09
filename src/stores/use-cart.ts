import { ProductCart } from '@/types';
import { create } from 'zustand';

type UseCartStore = {
  carts: ProductCart[];
  count: number;
  setCarts: (newCart: ProductCart[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const useCartStore = create<UseCartStore>((set, get) => ({
  carts: [],
  count: get()?.carts?.length ?? 0,
  setCarts: (newCart) => set({ carts: newCart }),
  loading: false,
  setLoading: (updateLoading) => set({ loading: updateLoading }),
}));

export default useCartStore;
