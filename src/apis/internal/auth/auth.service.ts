import { api } from "..";
import type { ServiceResponse, ValidationResponse } from "@/types";

export const validateField = async (body: {
  email?: string;
  phone_number?: string;
  id_card?: string;
}) => {
  const { data } = await api.post<ServiceResponse<ValidationResponse>>(
    "/user/validate",
    body
  );

  return data;
};
