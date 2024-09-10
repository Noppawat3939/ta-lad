import type {
  InsertProduct,
  Product,
  ProductCategory,
  ServiceResponse as TRes,
} from "@/types";
import { api } from "..";

export type CategoryResponse = TRes<{ data: ProductCategory[]; total: number }>;
export type GetSellerProducts = TRes<{ total: number; data: Product[] }>;
export type GetProductsList = TRes<{ total: number; data: Product[] }>;
export type GetProductBySKU = TRes<{ data: Product }>;
type UpdateProductSKU = TRes<null>;

export const getCategoryList = async () => {
  const { data } = await api.get<CategoryResponse>("/product/category/list");
  return data;
};

export const insertProductItem = async (body: { data: InsertProduct[] }) => {
  const { data } = await api.post<TRes<null>>("/product/item/insert", body);
  return data;
};

export const getSellerProductList = async () => {
  const { data } = await api.post<GetSellerProducts>("/product/item/seller");
  return data;
};

export const getProductList = async (params?: {
  page: number;
  page_size: number;
}) => {
  const { data } = await api.get<GetProductsList>("/product/item/list", {
    params,
    timeout: 10000,
  });
  return data;
};

export const updateSkuProduct = async () => {
  const { data } = await api.post<UpdateProductSKU>("/product/item/sku/update");
  return data;
};

export const getProductBySKU = async (sku: string) => {
  const { data } = await api.get<GetProductBySKU>(`/product/item/${sku}`, {
    timeout: 10000,
  });
  return data;
};
