import { AuthProvider } from "@/provider";
import { PropsWithChildren } from "react";

type BussinessLayoutProps = Readonly<PropsWithChildren>;

export default function BussinessLayout({ children }: BussinessLayoutProps) {
  return (
    <main aria-label="bussiness-layout">
      <AuthProvider allowedRoles={["store"]}>{children}</AuthProvider>
    </main>
  );
}
