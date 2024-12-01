import { MainLayout, RegisterForm } from "@/components";
import { type Metadata } from "next";

export const metadata: Metadata = { title: "JUDPI สมัครสมาชิกสำหรับลูกค้า" };

export default function RegisterWithUserPage() {
  return (
    <MainLayout className="flex justify-center items-center py-4 max-sm:p-3">
      <section className="max-w-[640px] w-full max-sm:max-w-[380px]">
        <RegisterForm withRole="end-user" />
      </section>
    </MainLayout>
  );
}
