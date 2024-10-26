import { productService } from "@/apis";
import { useCartStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useGetCarts(enabled = false) {
  const { carts, setCarts } = useCartStore();

  const { data, ...rest } = useQuery({
    queryKey: ["product-carts"],
    queryFn: productService.getCartsUser,
    select: ({ data }) => data,
    enabled,
  });

  useEffect(() => {
    if (!data) return;

    setCarts(data);
  }, [data]);

  return { carts, ...rest };
}
