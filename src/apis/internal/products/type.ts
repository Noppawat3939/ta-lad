import type {
  GroupProduct,
  Product,
  ProductCategory,
  ProductShipping,
  ServiceResponse,
  User,
} from "@/types";

export type UpdateProductSKU = ServiceResponse<null>;

export type ProductsWithTotal = { total: number; data: Product[] };

export type GetListProductBySKU = ServiceResponse<{
  data: {
    all_product: Product[];
    new_arriaval: Product[];
    seller: PickedSeller;
  };
}>;

export type PickedSeller = Pick<
  User,
  "id" | "store_name" | "created_at" | "updated_at" | "profile_image"
> & { product_list_count: number; products_soldout_count?: number };

export type OmittedGroupProduct = Omit<Product, "group_product">;

export type Updated = ServiceResponse<null>;

export type GetProductsRelateBySKU = ServiceResponse<ProductsWithTotal>;

export type CategoryResponse = ServiceResponse<{
  data: ProductCategory[];
  total: number;
}>;

export type GetSellerProducts = ServiceResponse<ProductsWithTotal>;

export type GetProductsList = ServiceResponse<ProductsWithTotal>;

export type GetProductBySKU = ServiceResponse<{
  data: OmittedGroupProduct & {
    seller: PickedSeller;
    group_products?: Omit<GroupProduct, "product_ids"> & {
      products: OmittedGroupProduct[];
    };
    product_shipping?: ProductShipping;
  };
}>;
