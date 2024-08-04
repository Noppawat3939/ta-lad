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

export default function LoginForm() {
  const [values, setValues] = useState({ email: "", password: "" });

  const [err, formAction] = useFormState(
    () => loginAction(values, ({ data }) => onSubmit(data as typeof values)),
    {}
  );
  const { pending } = useFormStatus();

  const onSubmit = (data: typeof values) => {
    console.log(123, data);
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
            {"เข้าสู่ระบบ"}
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
              isInvalid={Boolean(err?.email)}
              errorMessage={err?.email?.[0]}
            />
            <InputPassword
              variant="bordered"
              label="รหัสผ่าน"
              isInvalid={Boolean(err?.password)}
              errorMessage={err?.password?.[0]}
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
            <Button type="submit" color="primary" isLoading={pending}>
              {"ล็อคอิน"}
            </Button>
            <p className="flex gap-1 justify-center text-sm">
              {"ยังไม่เคยลงทะเบียน"}
              <Link
                color="primary"
                href="/registration"
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
