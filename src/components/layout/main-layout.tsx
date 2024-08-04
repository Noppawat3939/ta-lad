import { cn } from "@nextui-org/theme";
import { type PropsWithChildren } from "react";
import { Navbar } from "..";

type MainLayoutProps = Readonly<
  PropsWithChildren & {
    className?: string;
    hideNavbar?: boolean;
  }
>;

export default function MainLayout({
  children,
  className,
  hideNavbar = false,
}: MainLayoutProps) {
  return (
    <main>
      {!hideNavbar && <Navbar />}
      <section
        aria-label="main-layout"
        className={cn(
          className,
          "bg-gradient-to-b from-white via-slate-50/60 to-slate-100/50",
          hideNavbar ? "min-h-screen" : "min-h-[calc(100dvh_-_80px)]"
        )}
      >
        {children}
      </section>
    </main>
  );
}
