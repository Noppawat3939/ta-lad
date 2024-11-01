"use client";

import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

type AppProviderProps = Readonly<PropsWithChildren>;

export default function AppProvider({ children }: AppProviderProps) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 3000,
      },
    },
  });

  return (
    <NextUIProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </NextUIProvider>
  );
}
