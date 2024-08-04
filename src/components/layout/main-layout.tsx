import { cn } from "@nextui-org/theme";
import { Fragment, PropsWithChildren } from "react";
import { Navbar } from "..";

type MainLayoutProps = Readonly<PropsWithChildren & { className?: string }>;

export default function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <main>
      <Navbar />
      <section
        aria-label="main-layout"
        className={cn(
          className,
          "h-[calc(100dvh_-_80px)] bg-gradient-to-b from-white via-slate-50/60 to-slate-100/50"
        )}
      >
        {children}
      </section>
    </main>
  );
}
