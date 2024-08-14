import { LoginForm, MainLayout } from "@/components";
import { type Metadata } from "next";

export const metadata: Metadata = { title: "JUDPI - เข้าสู่ระบบ" };

export default function UserLoginPage() {
  return (
    <MainLayout hideBackBtn className="flex justify-center items-center">
      <section className="max-w-[520px] w-full max-sm:max-w-[380px]">
        <LoginForm withRole="end-user" />
      </section>
    </MainLayout>
  );
}
