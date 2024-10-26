import { useEffect } from "react";
import { userService } from "@/apis";
import { useUserStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";

export default function useGetUser() {
  const { setUser } = useUserStore();

  const { data, ...rest } = useQuery({
    queryKey: ["user"],
    queryFn: userService.getUser,
    select: ({ data }) => data?.data,
  });

  useEffect(() => {
    if (!data) return;

    setUser(data);
  }, [data]);

  return { userData: data, ...rest };
}
