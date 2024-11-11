import { useEffect } from "react";
import { userService } from "@/apis";
import { useUserStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { hasCookie } from "cookies-next";

export default function useGetUser() {
  const { setUser } = useUserStore();

  const { data, ...rest } = useQuery({
    queryKey: ["user"],
    queryFn: userService.getUser,
    select: ({ data }) => data?.data,
    enabled: ["session", "store_session"].some((key) => hasCookie(key)),
  });

  useEffect(() => {
    if (!data) return;

    setUser(data);
  }, [data]);

  return { userData: data, ...rest };
}
