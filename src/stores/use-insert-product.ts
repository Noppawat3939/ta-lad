import { create } from "zustand";

export interface InsertProductState {
  product_name: string;
  brand: string;
  description?: string;
  category_name: string;
  price: number;
  stock_amount: number;
  sold_amount?: number;
  discount_percent?: number;
  discount_price?: number;
  discount_start_date?: string;
  discount_end_date?: string;
  product_images: string[];
  product_main_image: string;
  is_preorder: boolean;
  shipping_provider: string;
  shipping_fee?: number;
  shipping_delivery_time: string;
}

type InsertProductStore = {
  values: InsertProductState;
  setValues: (state: InsertProductState) => void;
};

const initial: InsertProductState = {
  product_name: "",
  brand: "",
  description: undefined,
  category_name: "",
  price: 0,
  stock_amount: 0,
  sold_amount: 0,
  discount_percent: undefined,
  discount_price: undefined,
  discount_start_date: undefined,
  discount_end_date: undefined,
  product_images: [],
  product_main_image: "",
  is_preorder: false,
  shipping_provider: "",
  shipping_fee: undefined,
  shipping_delivery_time: "",
};

const useInsertProductStore = create<InsertProductStore>((set) => ({
  values: initial,
  setValues: (state) => set({ values: state }),
}));

export default useInsertProductStore;
