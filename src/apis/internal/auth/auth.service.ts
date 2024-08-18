import { api } from "..";
import type {
  CreateUser,
  LoginUser,
  LoginUserResponse,
  ServiceResponse as TRes,
  ValidationResponse,
  VerifyEmailResponse,
} from "@/types";

export const validateField = async (body: {
  email?: string;
  phone_number?: string;
  id_card?: string;
  role?: string;
}) => {
  const { data } = await api.post<TRes<ValidationResponse>>(
    "/user/validate",
    body
  );

  return data;
};

export const verifyEmail = async (body: { email: string }) => {
  const { data } = await api.post<TRes<VerifyEmailResponse>>(
    "/auth/verify-email",
    body
  );

  return data;
};

export const createUser = async (body: CreateUser) => {
  const { data } = await api.post<TRes<undefined>>("/auth/create-user", body);

  return data;
};

export const createSeller = async (body: CreateUser) => {
  const { data } = await api.post<TRes<undefined>>(
    "/auth/create-user-seller",
    body
  );
  return data;
};

export const loginUser = async (body: LoginUser) => {
  const { data } = await api.post<TRes<LoginUserResponse>>(
    "/auth/login-user",
    body
  );

  return data;
};

export const loginSeller = async (body: LoginUser) => {
  const { data } = await api.post("/auth/login-seller", body);
  return data;
};
