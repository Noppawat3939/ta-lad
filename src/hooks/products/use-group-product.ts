import { productService } from "@/apis";
import { useMutation } from "@tanstack/react-query";

type UseGroupProductMutationParams = {
  onSuccess?: () => void;
  onError?: () => void;
};

export default function useGroupProduct(
  params?: UseGroupProductMutationParams
) {
  const insertGroupMutation = useMutation({
    mutationFn: productService.insertgroupProducts,
    onError: () => params?.onError?.(),
    onSuccess: () => params?.onSuccess?.(),
  });

  return insertGroupMutation;
}
