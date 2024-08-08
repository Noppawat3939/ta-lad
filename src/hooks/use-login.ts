import { authService } from "@/apis";
import { delay } from "@/lib";
import { DecodeJwt } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

export default function useLogin() {
  const [callbackLogin, setCallbackLogin] = useState({
    onSuccess: () => {},
    onError: () => {},
  });

  const loginUserMutation = useMutation({
    mutationFn: authService.loginUser,
    onSuccess: async ({ data }) => {
      if (data?.data) {
        const decoded: DecodeJwt = jwtDecode(data.data);

        const cookies = [
          { key: "session", value: data.data },
          { key: "rdtk", value: decoded.session_key },
          {
            key: "last_login",
            value: new Date(data.timestamps),
            options: false,
          },
        ];

        cookies.forEach((c) =>
          setCookie(
            c.key,
            c.value,
            c.options === false
              ? undefined
              : {
                  expires: new Date(Number(decoded?.exp! * 1000)),
                  secure: true,
                }
          )
        );

        await delay(1000);
        callbackLogin.onSuccess();
      }
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        console.log(e.response?.data);
      }

      callbackLogin.onError();
    },
  });

  return {
    onLogin: loginUserMutation.mutate,
    setCallbackLogin,
    ...loginUserMutation,
  };
}