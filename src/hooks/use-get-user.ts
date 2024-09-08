import { useEffect } from "react";
import { userService } from "@/apis";
import { useUserStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError, HttpStatusCode } from "axios";

export default function useGetUser() {
  const router = useRouter();

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

  useEffect(() => {
    const err = rest.error as AxiosError;
    if (err?.response?.status === HttpStatusCode.Unauthorized) {
      router.replace("/");
    }

    return () => console.clear();
  }, [rest?.error]);

  const userData = data?.data?.data;

  return { userData, ...rest };
}
