"use client";

import { ContentLayout, MainNavbar } from "@/components";
import { useSearchKeywordStore } from "@/stores";
import { Suspense, useEffect } from "react";

function Home() {
  const { onOpen } = useSearchKeywordStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ([e.metaKey, e.ctrlKey].some(Boolean) && e.key === "k") {
        onOpen();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen">
      <MainNavbar />
      <section className="border-4 w-full border-red-500 h-[540px]">
        categories
      </section>
      <ContentLayout>HomePage</ContentLayout>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
