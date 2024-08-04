export type ServiceResponse<TData> = {
  success: boolean;
  message?: string | null;
} & { data?: TData };
