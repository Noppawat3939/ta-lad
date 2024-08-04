"use client";

import { Input, type InputProps, cn } from "@nextui-org/react";
import { OTPInput, type OTPInputProps } from "input-otp";

type InputOtpProps = { length?: number } & Pick<
  OTPInputProps,
  "value" | "onChange"
> & { inputProps?: Omit<InputProps, "value" | "onChange"> };

export default function InputOtp({
  length = 4,
  value,
  onChange,
  inputProps,
}: InputOtpProps) {
  const size = inputProps?.size ?? "md";

  return (
    <OTPInput
      maxLength={length}
      onChange={onChange}
      value={value}
      render={(props) => (
        <div className="flex gap-2">
          {props.slots.slice(0, length).map((slot, i) => (
            <Input
              key={`slop-${i}`}
              {...inputProps}
              value={slot.char ?? ""}
              className={cn(
                size === "lg"
                  ? "w-[48px]"
                  : size === "md"
                  ? "w-[40px]"
                  : "w-[32px]"
              )}
              classNames={{
                input: cn(
                  "text-center",
                  size === "lg"
                    ? "text-2xl"
                    : size === "md"
                    ? "text-xl"
                    : "text-lg",
                  "text-slate-800"
                ),
              }}
              variant="bordered"
            />
          ))}
        </div>
      )}
    />
  );
}
