import { LoginForm, MainFooter, MainLayout } from "@/components";
import { type Metadata } from "next";
import { Fragment, Suspense } from "react";

export const metadata: Metadata = { title: "JUDPI - เข้าสู่ระบบ" };

function UserLogin() {
  return (
    <Fragment>
      <MainLayout
        hideBackBtn
        className="flex flex-col justify-center items-center"
      >
        <section className="max-w-[520px] justify-center flex-col flex flex-1 w-full max-sm:max-w-[380px]">
          <LoginForm withRole="end-user" />
        </section>
        <MainFooter />
      </MainLayout>
    </Fragment>
  );
}

export default function UserLoginPage() {
  return (
    <Suspense>
      <UserLogin />
    </Suspense>
  );
}
