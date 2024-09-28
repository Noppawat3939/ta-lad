import { productService } from "@/apis";
import { useQuery } from "@tanstack/react-query";

export default function useGetCategory(enabled?: boolean) {
  const { data: categories, ...rest } = useQuery({
    queryKey: ["product-categories"],
    queryFn: productService.getCategoryList,
    select: ({ data }) => data?.data || [],
    enabled,
  });

  return { categories, ...rest };
}
