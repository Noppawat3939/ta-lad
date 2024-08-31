import type { UploadImage } from "@/types";
import { api } from "..";

export const uploadImage = async (body: FormData) => {
  const { data } = await api.post<UploadImage>("upload", body);
  return data;
};
