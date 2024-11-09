import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

type HomeLayoutProps = Readonly<PropsWithChildren>;

export const metadata: Metadata = {
  title: "JUDPI จัดไป ช็อปปิงออนไลน์ ส่งฟรีทุกวัน",
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  return <main aria-label="app-layout">{children}</main>;
}
