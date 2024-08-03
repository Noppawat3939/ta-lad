import { cn } from "@nextui-org/theme";
import { PropsWithChildren } from "react";

type MainLayoutProps = Readonly<PropsWithChildren & { className?: string }>;

export default function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <main
      className={cn(
        className,
        "h-screen bg-gradient-to-b from-white via-slate-50/60 to-slate-100/50"
      )}
    >
      {children}
    </main>
  );
}
