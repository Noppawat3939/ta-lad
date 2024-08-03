"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps,
  Input,
  Link,
  cn,
} from "@nextui-org/react";
import { InputPassword } from ".";
import { ChevronRight, Circle, CircleCheckBig } from "lucide-react";
import { Fragment, useCallback, useState } from "react";

const PASSWORD_CON_LABEL = {
  number: "ตัวเลข (0-9) อย่างน้อย 1 ตัว",
  lowercase: "ตัวพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว",
  uppercase: "ตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว",
  length: "ความยาวอย่างน้อย 8 ตัวอักษร",
};

type RegisterFormProps = {
  cardProps?: CardProps;
};

export default function RegisterForm({ cardProps }: RegisterFormProps) {
  const [registerValues, setRegisterValues] = useState({
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [step, setStep] = useState(1);
  const [passwordIsValid, setPasswordIsValid] = useState({
    number: false,
    lowercase: false,
    uppercase: false,
    length: false,
  });

  const validatePasswordValid = useCallback((password: string) => {
    const lowerCaseValid = /[a-z]/.test(password);
    const upperCaseValid = /[A-Z]/.test(password);
    const digitValid = /\d/.test(password);
    const lengthValid = password.trim().length >= 8;

    setPasswordIsValid({
      number: digitValid,
      length: lengthValid,
      lowercase: lowerCaseValid,
      uppercase: upperCaseValid,
    });
  }, []);

  const onChangeValue = useCallback(
    (field: keyof typeof registerValues, value: string) => {
      if (field === "password") {
        validatePasswordValid(value);
      }

      setRegisterValues((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleIncreaseStep = () => {
    setStep((prev) => prev + 1);
  };

  const renderFirstStep = () => {
    return (
      <Fragment>
        <Input
          value={registerValues.email}
          onChange={(e) => onChangeValue("email", e.target.value)}
          label="อีเมลล์"
          autoComplete="off"
        />
        <InputPassword
          label="รหัสผ่าน"
          autoComplete="off"
          value={registerValues.password}
          onChange={(e) => onChangeValue("password", e.target.value)}
        />
        <Input
          value={registerValues.phoneNumber}
          onChange={(e) => onChangeValue("phoneNumber", e.target.value)}
          label="เบอร์โทรศัพท์"
          autoComplete="off"
        />
        <h3 className="font-medium text-sm">{"รหัสผ่านต้องประกอบไปด้วย"}</h3>
        <ul className="gap-2 flex flex-col">
          {Object.keys(PASSWORD_CON_LABEL).map((key, i) => {
            const containLabel =
              PASSWORD_CON_LABEL[key as keyof typeof PASSWORD_CON_LABEL];

            return (
              <li
                key={`contain-${i}`}
                className={cn(
                  "text-xs flex items-center gap-1",
                  passwordIsValid[key as keyof typeof passwordIsValid]
                    ? "text-teal-500"
                    : "text-gray-300"
                )}
              >
                {passwordIsValid[key as keyof typeof passwordIsValid] ? (
                  <CircleCheckBig className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                {containLabel}
              </li>
            );
          })}
        </ul>
      </Fragment>
    );
  };

  const renderSecondStep = () => {
    return (
      <Fragment>
        <Input label="เลขบัตรประชาชน" />
      </Fragment>
    );
  };

  return (
    <Card {...cardProps} className="py-[24px] px-2">
      <CardHeader>
        <h2 className="text-xl font-semibold w-full text-center">
          {"สมัครสมาชิกสำหรับผู้ใช้งานใหม่"}
        </h2>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-4">
          {step === 1 && renderFirstStep()}
          {step === 2 && renderSecondStep()}
        </div>
      </CardBody>
      <CardFooter className="mt-3">
        <div className="flex flex-col w-full gap-3">
          <Button
            color={"primary"}
            className="w-full"
            type="button"
            onClick={handleIncreaseStep}
          >
            {"ต่อไป"}
            <ChevronRight className="w-4 h-4" />
          </Button>
          <div className="flex space-x-2 justify-center items-baseline">
            <p className="text-sm">{"ฉันเป็นสมาชิกอยู่แล้ว"}</p>
            <Link color="primary" className="cursor-pointer text-sm">
              {"ล็อคอิน"}
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
