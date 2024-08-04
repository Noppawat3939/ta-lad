import { MainLayout, RegisterForm } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = { title: "สมัครสมาชิกสำหรับลูกค้า" };

export default function RegisterWithUserPage() {
  return (
    <MainLayout className="flex justify-center items-center">
      <section className="max-w-[640px] w-full max-sm:max-w-[380px]">
        <RegisterForm withRole="end-user" />
      </section>
    </MainLayout>
  );
}
