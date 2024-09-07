"use client";

import { memo } from "react";

function Footer() {
  return (
    <footer
      aria-label="main-footer"
      className="bg-white w-full h-[64px] flex justify-center items-center"
    >
      <p className="text-[#FF731D] font-[300] text-sm">{`© ${new Date().getFullYear()} Copyright | Judpi.com`}</p>
    </footer>
  );
}

export const MainFooter = memo(Footer);
