import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

type ProductLayoutProps = PropsWithChildren;

export const metadata: Metadata = {
  title: "JUDPI - ระบบจัดการสินค้าของคุณ",
  keywords: ["products", "insert-product", "orders"],
};

export default function ProductLayout({ children }: ProductLayoutProps) {
  return <main aria-label="products-layout">{children}</main>;
}
