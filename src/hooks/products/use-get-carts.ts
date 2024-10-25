import { productService } from "@/apis";
import { isUndefined } from "@/lib";
import { useCartStore, useUserStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";

export default function useGetCarts() {
  const user = useUserStore((s) => s.user);

  const { carts, setCarts } = useCartStore();

  const { data, ...rest } = useQuery({
    queryKey: ["product-carts"],
    queryFn: productService.getCartsUser,
    select: ({ data }) => setCarts(data || []),
    enabled: !isUndefined(user?.id),
  });

  return { carts, ...rest };
}
