import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/provider";

type ProductLayoutProps = PropsWithChildren;

export const metadata: Metadata = {
  title: "JUDPI - ระบบจัดการสินค้าของคุณ",
  keywords: ["products", "insert-product", "orders"],
};

export default function ProductLayout({ children }: ProductLayoutProps) {
  return (
    <AuthProvider allowedRoles={["store"]}>
      <section aria-label="products-layout">{children}</section>
    </AuthProvider>
  );
}
