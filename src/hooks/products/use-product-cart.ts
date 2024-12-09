import { productService } from '@/apis';
import { useCartStore } from '@/stores';
import { useMutation } from '@tanstack/react-query';

export default function useProductCart() {
  const { setCarts, setLoading } = useCartStore();

  const {
    mutateAsync,
    mutate: _get,
    ...rest
  } = useMutation({
    mutationFn: productService.getCartsUser,
    mutationKey: ['get_carts'],
    onSuccess: ({ data }) => {
      setLoading(false);
      setCarts(data || []);
    },
    onError: (e) => {
      console.error('failed get carts', e);
      setLoading(false);
    },
    onMutate: () => setLoading(true),
  });

  return { getCarts: mutateAsync, _get: rest };
}
