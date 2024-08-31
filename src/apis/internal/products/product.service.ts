import type {
  InsertProduct,
  ProductCategory,
  ServiceResponse as TRes,
} from "@/types";
import { api } from "..";

type CategoryResponse = TRes<{ data: ProductCategory[]; total: number }>;

export const getCategoryList = async () => {
  const { data } = await api.get<CategoryResponse>("/product/category/list");
  return data;
};

export const insertProductItem = async (body: { data: InsertProduct[] }) => {
  const { data } = await api.post<TRes<null>>("/product/item/insert", body);
  return data;
};
