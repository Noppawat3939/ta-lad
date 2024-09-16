import type {
  InsertProduct,
  Pagination,
  Product,
  ProductCategory,
  ServiceResponse as TRes,
  User,
} from "@/types";
import { api } from "..";

type UpdateProductSKU = TRes<null>;
type ProductsWithTotal = { total: number; data: Product[] };
type PickedSeller = Pick<
  User,
  "id" | "store_name" | "created_at" | "updated_at" | "profile_image"
>;

export type CategoryResponse = TRes<{ data: ProductCategory[]; total: number }>;
export type GetSellerProducts = TRes<ProductsWithTotal>;
export type GetProductsList = TRes<ProductsWithTotal>;
export type GetProductBySKU = TRes<{
  data: Product & { seller: PickedSeller & { product_list_count: number } };
}>;
export type GetProductsRelateBySKU = TRes<ProductsWithTotal>;

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

export const getProductsRelateBySKU = async (
  sku: string,
  pagination: Pagination
) => {
  const { data } = await api.get<GetProductsRelateBySKU>(
    `/product/item/relate/${sku}`,
    {
      params: pagination,
    }
  );
  return data;
};
