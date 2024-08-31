import { cn } from "@nextui-org/theme";
import { type PropsWithChildren } from "react";
import { Modal, Navbar } from "..";

type MainLayoutProps = Readonly<
  PropsWithChildren & {
    className?: string;
    hideNavbar?: boolean;
    hideBackBtn?: boolean;
  }
>;

export default function MainLayout({
  children,
  className,
  hideNavbar = false,
  hideBackBtn = false,
}: MainLayoutProps) {
  return (
    <main>
      {!hideNavbar && <Navbar hideBackBtn={hideBackBtn} />}
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
