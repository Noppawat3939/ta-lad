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
  limit: number;
}) => {
  const { data } = await api.get<GetProductsList>("/product/item/list", {
    params,
  });
  return data;
};

export const updateSkuProduct = async () => {
  const { data } = await api.post("/product/item/sku/update");
  return data;
};
