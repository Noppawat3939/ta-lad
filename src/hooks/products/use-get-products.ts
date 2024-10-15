import { productService } from "@/apis";
import type { QueryPropducts } from "@/types";
import { useQuery } from "@tanstack/react-query";

type UseGetProductsParams = {
  page: number;
  page_size: number;
} & QueryPropducts;

export default function useGetProducts(params: UseGetProductsParams) {
  const { data: products, ...rest } = useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProductList(params),
    select: ({ data }) => data?.data || [],
  });

  return { products, ...rest };
}
