"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  cn,
} from "@nextui-org/react";
import { InputPassword } from ".";
import { ChevronRight, Circle, CircleCheckBig } from "lucide-react";
import { useCallback, useState } from "react";

const PASSWORD_CON_LABEL = {
  number: "At least one digit (0-9)",
  lowercase: "A lower-case letter",
  uppercase: "A upper-case letter",
  length: "At least 8 characters",
};

export default function RegisterForm() {
  const [registerValues, setRegisterValues] = useState({
    email: "",
    password: "",
  });

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

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col gap-4">
          RegisterForm
          <Input
            value={registerValues.email}
            onChange={(e) => onChangeValue("email", e.target.value)}
            label="Email"
            placeholder="user@talad.com"
          />
          <InputPassword
            label="Password"
            placeholder="password"
            value={registerValues.password}
            onChange={(e) => onChangeValue("password", e.target.value)}
          />
          <h3 className="font-medium text-sm">Password must contain</h3>
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
        </div>
      </CardBody>
      <CardFooter>
        <Button color="primary">
          Continue
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
