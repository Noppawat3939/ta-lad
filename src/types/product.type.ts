export interface ProductCategory {
  id: number;
  name: string;
  image: string;
}

export interface InsertProduct {
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
  product_images: { image: string; is_main: boolean }[];
  is_preorder: boolean;
  provider: string;
  shipping_fee: number;
  delivery_time: number;
}

export interface Product {
  id: number;
  product_name: string;
  description?: string;
  category_name: string;
  brand: string;
  price: number;
  stock_amount: number;
  sold_amount: number;
  discount_percent: number;
  discount_price: number;
  discount_start_date?: string;
  discount_end_date?: string;
  created_at: string;
  updated_at: string;
  image: string[];
  sku: string;
  group_product?: GroupProduct;
}

export interface GroupProduct {
  id: number;
  name: string;
  product_ids: number[];
}
