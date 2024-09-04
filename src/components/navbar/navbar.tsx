"use client";

import { Link } from "@nextui-org/react";
import { cn } from "@nextui-org/theme";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type NavbarProps = { className?: string; hideBackBtn?: boolean };

export default function Navbar({
  className,
  hideBackBtn = false,
}: NavbarProps) {
  const router = useRouter();

  return (
    <nav
      className={cn(
        "sticky top-0 z-10 bg-white drop-shadow-sm h-[80px] flex items-center",
        className
      )}
    >
      <div className="flex flex-1 relative justify-center">
        {!hideBackBtn && (
          <Link
            onClick={router.back}
            className="absolute left-10 max-md:left-6 max-sm:left-3 text-sm top-[50%] cursor-pointer translate-y-[-50%]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {"ย้อนกลับ"}
          </Link>
        )}
        <Link href="/">
          <img
            className="cursor-pointer object-cover h-[80px] w-[120px]"
            alt="app-logo"
            src="/images/logo-second.png"
          />
        </Link>
      </div>
    </nav>
  );
}
