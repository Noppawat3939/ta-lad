import { useEffect } from "react";
import { userService } from "@/apis";
import { useUserStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";

export default function useGetUser() {
  const { setUser } = useUserStore();

  const { data, ...rest } = useQuery({
    queryKey: ["user"],
    staleTime: 60000,
    queryFn: userService.getUser,
  });

  useEffect(() => {
    if (data?.data) {
      setUser(data.data.data);
    }
  }, [data?.data]);

  const userData = data?.data?.data;

  return { userData, ...rest };
}
