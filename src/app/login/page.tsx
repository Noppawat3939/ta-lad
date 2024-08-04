import { LoginForm, MainLayout } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default function LoginPage() {
  return (
    <MainLayout hideNavbar className="flex justify-center items-center">
      <section className="max-w-[520px] w-full max-sm:max-w-[380px]">
        <LoginForm />
      </section>
    </MainLayout>
  );
}
