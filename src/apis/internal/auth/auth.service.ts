import { api } from "..";
import type {
  CreateUser,
  LoginUser,
  LoginUserResponse,
  ServiceResponse,
  ValidationResponse,
  VerifyEmailResponse,
} from "@/types";

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

export const verifyEmail = async (body: { email: string }) => {
  const { data } = await api.post<ServiceResponse<VerifyEmailResponse>>(
    "/auth/verify-email",
    body
  );

  return data;
};

export const createUser = async (body: CreateUser) => {
  const { data } = await api.post<ServiceResponse<undefined>>(
    "/auth/create-user",
    body
  );

  return data;
};

export const loginUser = async (body: LoginUser) => {
  const { data } = await api.post<ServiceResponse<LoginUserResponse>>(
    "/auth/login-user",
    body
  );

  return data;
};
