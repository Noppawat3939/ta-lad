"use client";

import { Suspense, useEffect, useState } from "react";
import { api } from "@/apis";
import { ContentLayout, MainNavbar } from "@/components";
import { useSearchKeywordStore } from "@/stores";
import { Button, Input } from "@nextui-org/react";

function Home() {
  const { onOpen } = useSearchKeywordStore();

  const [fileImage, setFileImage] = useState<File | undefined>(undefined);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ([e.metaKey, e.ctrlKey].some(Boolean) && e.key === "k") {
        onOpen();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  const upload = async () => {
    if (!fileImage) return;

    try {
      const formData = new FormData();
      formData.append("image", fileImage);
      const res = await api.post("/upload", formData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen">
      <MainNavbar />
      <section className="border-4 w-full border-red-500 h-[540px]">
        categories
      </section>
      <ContentLayout>
        HomePage
        <Input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => {
            const file = e.target.files?.[0];

            setFileImage(file);
          }}
        />
        <Button onClick={upload}>upload</Button>
      </ContentLayout>
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
