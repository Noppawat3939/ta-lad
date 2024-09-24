import type {
  GroupProduct,
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
> & { product_list_count: number; products_soldout_count?: number };
type OmittedGroupProduct = Omit<Product, "group_product">;

export type CategoryResponse = TRes<{ data: ProductCategory[]; total: number }>;
export type GetSellerProducts = TRes<ProductsWithTotal>;
export type GetProductsList = TRes<ProductsWithTotal>;
export type GetProductBySKU = TRes<{
  data: OmittedGroupProduct & {
    seller: PickedSeller;
    group_products?: Omit<GroupProduct, "product_ids"> & {
      products: OmittedGroupProduct[];
    };
  };
}>;
export type GetProductsRelateBySKU = TRes<ProductsWithTotal>;
type GetListProductBySKU = TRes<{
  data: {
    all_product: Product[];
    new_arriaval: Product[];
    seller: PickedSeller;
  };
}>;

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
      timeout: 10000,
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
      timeout: 10000,
      params: pagination,
    }
  );
  return data;
};

export const insertgroupProducts = async (body: {
  name: string;
  product_ids: number[];
}) => {
  const { data } = await api.post<TRes<null>>("/product/group/insert", body);
  return data;
};

export const unGroupProducts = async (group_product_id: number) => {
  const { data } = await api.post<TRes<null>>("/product/group/ungroup", {
    group_product_id,
  });
  return data;
};
