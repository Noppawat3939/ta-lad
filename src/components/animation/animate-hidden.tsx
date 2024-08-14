"use client";

import { type PropsWithChildren } from "react";
import { motion as m } from "framer-motion";

type AnimateHiddenProps = PropsWithChildren & {
  className?: string;
  isCenter?: boolean;
};

export default function AnimateHidden({
  children,
  className,
  isCenter = false,
}: AnimateHiddenProps) {
  return (
    <m.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            delayChildren: 1,
          },
        },
      }}
    >
      {isCenter ? <center>{children}</center> : children}
    </m.div>
  );
}
