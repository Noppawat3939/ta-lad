import { productService } from "@/apis";
import { useMutation } from "@tanstack/react-query";

type UseUnGroupProductMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

export default function useUngroupProduct(
  params?: UseUnGroupProductMutationParams
) {
  const unGroupMutation = useMutation({
    mutationFn: productService.unGroupProducts,
    onError: () => params?.onError?.(),
    onSuccess: () => params?.onSuccess?.(),
  });

  return unGroupMutation;
}
