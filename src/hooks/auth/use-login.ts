import { useState } from "react";
import { authService } from "@/apis";
import { delay } from "@/lib";
import type { DecodeJwt } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

const initialState = {
  onSuccess: <T extends unknown>(_res?: T) => {},
  onError: () => {},
};

export default function useLogin(withSeller = false) {
  const [callbackLogin, setCallbackLogin] = useState(initialState);

  const loginUserMutation = useMutation({
    mutationFn: withSeller ? authService.loginSeller : authService.loginUser,
    onSuccess: async ({ data }) => {
      if (data?.data) {
        const decoded: DecodeJwt = jwtDecode(data.data);

        const cookies = [
          {
            key: withSeller ? "store_session" : "session",
            value: data.data,
          },
          {
            key: withSeller ? "srdtk" : "rdtk",
            value: decoded.session_key,
          },
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

        callbackLogin.onSuccess(data?.data);
      }
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        console.error(e.response?.data);
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
