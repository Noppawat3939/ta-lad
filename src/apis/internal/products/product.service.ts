import type { InsertProduct, Pagination, QueryPropducts } from "@/types";
import { api } from "..";
import { TIMEOUT } from "@/apis/constant";
import type {
  CategoryResponse,
  GetListProductBySKU,
  GetProductBySKU,
  GetProductsList,
  GetProductsRelateBySKU,
  GetSellerProducts,
  UpdateProductSKU,
  Updated,
} from "./type";

export const getCategoryList = async () => {
  const { data } = await api.get<CategoryResponse>("/product/category/list");
  return data;
};

export const insertProductItem = async (body: { data: InsertProduct[] }) => {
  const { data } = await api.post<Updated>("/product/item/insert", body);
  return data;
};

export const getSellerProductList = async () => {
  const { data } = await api.post<GetSellerProducts>("/product/item/seller");
  return data;
};

export const getProductList = async (
  params?: {
    page: number;
    page_size: number;
  } & QueryPropducts
) => {
  const { data } = await api.get<GetProductsList>("/product/item/list", {
    params,
    timeout: TIMEOUT,
  });
  return data;
};

export const updateSkuProduct = async () => {
  const { data } = await api.post<UpdateProductSKU>("/product/item/sku/update");
  return data;
};

export const getProductBySKU = async (sku: string) => {
  const { data } = await api.get<GetProductBySKU>(`/product/item/${sku}`, {
    timeout: TIMEOUT,
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
      timeout: TIMEOUT,
      params: pagination,
    }
  );
  return data;
};

export const getListProductBySKU = async (
  sku: string,
  pagination: Pagination
) => {
  const { data } = await api.get<GetListProductBySKU>(
    `/product/seller-product/list/${sku}`,
    {
      timeout: TIMEOUT,
      params: pagination,
    }
  );
  return data;
};

export const insertgroupProducts = async (body: {
  name: string;
  product_ids: number[];
}) => {
  const { data } = await api.post<Updated>("/product/group/insert", body);
  return data;
};

export const unGroupProducts = async (group_product_id: number) => {
  const { data } = await api.post<Updated>("/product/group/ungroup", {
    group_product_id,
  });
  return data;
};
