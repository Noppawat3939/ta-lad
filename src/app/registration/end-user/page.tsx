import { MainLayout, RegisterForm } from "@/components";

export default function RegisterWithUserPage() {
  return (
    <MainLayout className="flex justify-center items-center">
      <section className="max-w-[460px] w-full max-sm:max-w-[380px]">
        <RegisterForm />
      </section>
    </MainLayout>
  );
}
