"use client";

import { Input, type InputProps } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type InputPasswordProps = Omit<InputProps, "type">;

export default function InputPassword(props: InputPasswordProps) {
  const [isVisable, setIsVisable] = useState(false);

  return (
    <Input
      {...props}
      type={!isVisable ? "password" : "text"}
      endContent={
        <button
          onClick={() => setIsVisable(!isVisable)}
          className="focus:outline-none"
          type="button"
          aria-label="toggle password visibility"
        >
          {isVisable ? (
            <Eye className="text-gray-400" />
          ) : (
            <EyeOff className="text-gray-400" />
          )}
        </button>
      }
    />
  );
}
