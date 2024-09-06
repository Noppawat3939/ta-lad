"use client";

import { Button, Image, Link } from "@nextui-org/react";
import { ContentLayout, MainLayout } from "..";
import { useMetadata } from "@/hooks";
import { memo } from "react";

function NotFound() {
  useMetadata({ title: "404 ไม่พบหน้าที่ค้นหา" });

  return (
    <MainLayout hideBackBtn>
      <ContentLayout className="h-[cal(100dvh_-_80px)] bg-white items-center flex-1">
        <section className="flex flex-col gap-3 min-h-[calc(100vh_-_140px)] justify-center items-center">
          <Image
            src="/images/not-found.png"
            loading="lazy"
            alt="404"
            className="w-[320px] max-md:w-[280px] max-sm:w-[220px]"
          />
          <h3 className="text-xl font-medium">
            {"ขออภัย ไม่ค้นพบหน้าที่คุณค้นหา"}
          </h3>
          <Button
            className="mt-2"
            as={Link}
            href="/"
            variant="bordered"
            color="primary"
          >
            {"กลับไปยังหน้าแรก"}
          </Button>
        </section>
      </ContentLayout>
      <footer className="h-[60px] flex justify-center items-center bg-[#FF731D]">
        <h2 className="text-white text-sm font-medium">
          {`© ${new Date().getFullYear()} Judpi.co All rights reserved.`}
        </h2>
      </footer>
    </MainLayout>
  );
}

export const NotFoundContainer = memo(NotFound);
