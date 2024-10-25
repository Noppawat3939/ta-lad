"use client";

import type { PropsWithChildren } from "react";
import { useGetUser, useGetCartsProduct } from "@/hooks";
import { Role } from "@/types";
import { isEmpty } from "@/lib";
import { Spinner } from "@nextui-org/react";
import { NotFoundContainer } from "@/components";

type AuthProviderProps = Readonly<PropsWithChildren> & {
  allowedRoles?: Role[];
};

export default function AuthProvider({
  children,
  allowedRoles,
}: AuthProviderProps) {
  const { userData, isFetching } = useGetUser();
  useGetCartsProduct();

  if (
    userData &&
    !isEmpty(allowedRoles) &&
    !allowedRoles?.includes(userData.role)
  )
    return <NotFoundContainer />;

  return (
    <main aria-label="auth-provider-wrapper">
      {isFetching ? (
        <div className="flex flex-1 justify-center items-center h-screen">
          <Spinner size="sm" />
        </div>
      ) : (
        children
      )}
    </main>
  );
}
