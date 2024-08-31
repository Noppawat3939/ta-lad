"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link,
} from "@nextui-org/react";
import { InputPassword } from ".";
import { useCallback, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "@/actions";
import { AxiosError, HttpStatusCode } from "axios";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks";
import type { LoginUser } from "@/types";

type LoginFormProps = {
  withRole: "end-user" | "seller-user";
};

export default function LoginForm({ withRole }: LoginFormProps) {
  const router = useRouter();

  const isSeller = withRole === "seller-user";

  const [values, setValues] = useState<LoginUser>({ email: "", password: "" });

  const [err, formAction] = useFormState(
    () => loginAction(values, ({ data }) => onSubmit(data as typeof values)),
    null
  );
  const { pending } = useFormStatus();

  const {
    setCallbackLogin,
    onLogin,
    error: loginError,
    isPending,
  } = useLogin(isSeller);

  const error = loginError as AxiosError<{
    error_message?: string;
  }>;

  const onSubmit = (data: typeof values) => {
    setCallbackLogin({
      onError: () => {
        console.error("error");
      },
      onSuccess: () => router.push("/"),
    });

    onLogin(data);
  };

  const onChangeValue = useCallback(
    (field: keyof typeof values, value: string) =>
      setValues((prev) => ({ ...prev, [field]: value })),
    []
  );

  return (
    <Card className="py-[24px] px-2">
      <form action={formAction}>
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center flex-1">
            {isSeller ? "เข้าสู่ระบบสำหรับร้านค้า" : "เข้าสู่ระบบ"}
          </h1>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <Input
              variant="bordered"
              label="อีเมลล์"
              name="email"
              value={values.email}
              onChange={({ target: { value } }) =>
                onChangeValue("email", value)
              }
              isInvalid={
                Boolean(err?.email) ||
                [HttpStatusCode.NotFound, HttpStatusCode.BadRequest].includes(
                  Number(error?.response?.status)
                )
              }
              errorMessage={
                error?.response?.data?.error_message || err?.email?.[0]
              }
            />
            <InputPassword
              variant="bordered"
              label="รหัสผ่าน"
              isInvalid={
                Boolean(err?.password) ||
                [HttpStatusCode.BadRequest].includes(
                  Number(error?.response?.status)
                )
              }
              errorMessage={
                error?.response?.data?.error_message || err?.password?.[0]
              }
              name="password"
              value={values.password}
              onChange={({ target: { value } }) =>
                onChangeValue("password", value)
              }
            />
          </div>
        </CardBody>
        <CardFooter className="mt-3">
          <div className="flex flex-col w-full gap-4">
            <Button
              type="submit"
              color="primary"
              isLoading={pending || isPending}
            >
              {"ล็อคอิน"}
            </Button>
            <p className="flex gap-1 justify-center text-sm">
              {"ยังไม่เคยลงทะเบียน"}
              <Link
                color="primary"
                href={`/registration/${withRole}`}
                isDisabled={isPending}
                className="text-sm cursor-pointer hover:opacity-80"
              >
                {"คลิกที่นี่"}
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
