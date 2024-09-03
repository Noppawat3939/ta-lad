import { userService } from "@/apis";
import { useUserStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useGetUser() {
  const { setUser } = useUserStore();

  const { data } = useQuery({
    queryKey: ["user"],
    staleTime: 60000,
    queryFn: userService.getUser,
  });

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    }
  }, [data?.data]);

  return data?.data;
}
