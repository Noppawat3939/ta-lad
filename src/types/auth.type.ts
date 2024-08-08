import type { JwtPayload } from "jwt-decode";

export type ValidationResponse = {
  available: boolean;
  field?: string;
  error_message: string;
};

export type VerifyEmailResponse = {
  verify_token: string;
};

export type CreateUser = {
  email: string;
  password: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  id_card: string;
  address_card_id: string;
  province: string;
  district: string;
  sub_district: string;
  code: string;
  verify_token: string;
  store_name: string;
};

export type LoginUser = Pick<CreateUser, "email" | "password">;

export type LoginUserResponse = {
  data: string;
  timestamps: number;
};

export type DecodeJwt = {
  session_key: string;
  id: number;
  email: string;
} & JwtPayload;
