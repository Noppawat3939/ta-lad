import { productService } from "@/apis";
import { useQuery } from "@tanstack/react-query";

export default function useGetSellerProducts() {
  const query = useQuery({
    queryFn: productService.getSellerProductList,
    queryKey: ["seller-product"],
    select: ({ data }) => data?.data || [],
  });

  return query;
}
