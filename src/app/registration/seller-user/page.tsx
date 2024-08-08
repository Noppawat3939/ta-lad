import { MainLayout, RegisterForm } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "สมัครสมาชิกสำหรับร้านค้า",
};

export default function RegisterWithSellerPage() {
  return (
    <MainLayout className="flex justify-center items-center py-4 max-sm:p-3">
      <section className="max-w-[640px] w-full max-sm:max-w-[380px]">
        <RegisterForm withRole="seller-user" />
      </section>
    </MainLayout>
  );
}
