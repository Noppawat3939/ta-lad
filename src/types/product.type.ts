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
  product_image?: string[];
}

export interface Product {
  id: number;
  product_name: string;
  description?: any;
  category_name: string;
  brand: string;
  price: number;
  stock_amount: number;
  sold_amount: number;
  discount_percent: number;
  discount_price: number;
  discount_start_date?: any;
  discount_end_date?: any;
  created_at: string;
  updated_at: string;
  image: string[];
}
