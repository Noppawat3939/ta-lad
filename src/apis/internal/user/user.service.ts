import { api } from "..";
import type { ServiceResponse, User } from "@/types";

type GetUserResponse = ServiceResponse<User>;

export const getUser = async () => {
  const { data } = await api.get<GetUserResponse>("/user");
  return data;
};
