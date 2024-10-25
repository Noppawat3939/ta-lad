import { LoginForm, MainFooter, MainLayout } from "@/components";
import { type Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "JUDPI - เข้าสู่ระบบด้วยร้านค้า" };

function SellerLogin() {
  return (
    <MainLayout
      hideBackBtn
      className="flex justify-center flex-col items-center"
    >
      <section className="max-w-[520px] justify-center flex-col flex flex-1 w-full max-sm:max-w-[380px]">
        <LoginForm withRole="seller-user" />
      </section>
      <MainFooter />
    </MainLayout>
  );
}

export default function SellerLoginPage() {
  return (
    <Suspense>
      <SellerLogin />
    </Suspense>
  );
}
