import { api } from "..";
import type { ServiceResponse, User } from "@/types";

export type GetUserResponse = ServiceResponse<{ data: User }>;

export const getUser = async () => {
  const { data } = await api.get<GetUserResponse>("/user");
  return data;
};
