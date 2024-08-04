"use client";

import { Link } from "@nextui-org/react";
import { cn } from "@nextui-org/theme";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type NavbarProps = { className?: string };

export default function Navbar({ className }: NavbarProps) {
  const router = useRouter();

  const showBackBtn = true;

  return (
    <nav
      className={cn(
        "sticky top-0 bg-white drop-shadow-sm h-[80px] flex items-center",
        className
      )}
    >
      <div className="flex flex-1 relative justify-center">
        {showBackBtn && (
          <Link
            onClick={router.back}
            className="absolute left-10 text-sm top-[50%] cursor-pointer translate-y-[-50%]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {"ย้อนกลับ"}
          </Link>
        )}
        <h1 className="text-orange-500 text-lg font-extrabold">Logo app</h1>
      </div>
    </nav>
  );
}
