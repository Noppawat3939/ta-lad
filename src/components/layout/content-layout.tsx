import { type PropsWithChildren } from "react";
import { cn } from "@nextui-org/theme";

type ContentLayout = Readonly<PropsWithChildren & { className?: string }>;

export default function ContentLayout({ children, className }: ContentLayout) {
  return (
    <section
      role="content-layout"
      className={cn(
        "flex-1 w-full mx-auto max-w-[1240px] max-xl:max-w-[1024px] max-lg:max-w-[768px] max-md:max-w-[600px] max-sm:max-w-[524px] max-sm:px-4",
        className
      )}
    >
      {children}
    </section>
  );
}
