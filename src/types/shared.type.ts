import { Dayjs } from "dayjs";

export type ServiceResponse<TData> = {
  success: boolean;
  message?: string | null;
} & { data?: TData };

export type TDate = Dayjs | number | string | Date | null;

export type TDateFormat = "YYYY-MM-DD" | "DD/MM/YYYY";

export interface UploadImage {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
  api_key: string;
}

export interface User {
  id: number;
  email: string;
  profile_image: string;
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
  store_name?: string;
  role: Role;
}

export type Role = "user" | "store" | "admin";

export type Pagination = { page: number; page_size: number };
