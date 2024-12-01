import { useUserStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { useTransition } from "react";

export default function useLogout() {
  const queryClient = useQueryClient();

  const user = useUserStore((s) => s.user);

  const [_, startTransition] = useTransition();

  const handleLogout = () => {
    queryClient.clear();
    const loginnedCookieName =
      user && user.role === "store"
        ? ["store_session", "srdtk", "last_login"]
        : ["session", "rdtk", "last_login"];
    loginnedCookieName.forEach((name) => deleteCookie(name));

    startTransition(() => {
      typeof window !== "undefined" && window.location.replace("/");
    });
  };

  return handleLogout;
}
