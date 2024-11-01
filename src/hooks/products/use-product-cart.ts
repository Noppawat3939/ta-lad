import { productService } from "@/apis";
import { useCartStore } from "@/stores";
import { useMutation } from "@tanstack/react-query";

export default function useProductCart() {
  const { setCarts } = useCartStore();

  const {
    mutateAsync,
    mutate: _get,
    ...rest
  } = useMutation({
    mutationFn: productService.getCartsUser,
    mutationKey: ["get_carts"],
    onSuccess: ({ data }) => setCarts(data || []),
    onError: (e) => console.error("failed get carts", e),
  });

  return { getCarts: mutateAsync, _get: rest };
}
