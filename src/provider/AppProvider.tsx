import { NextUIProvider } from "@nextui-org/react";
import { PropsWithChildren } from "react";

type AppProviderProps = Readonly<PropsWithChildren>;

export default function AppProvider({ children }: AppProviderProps) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
