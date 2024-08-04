import { cn } from "@nextui-org/theme";

type NavbarProps = { className?: string };

export default function Navbar({ className }: NavbarProps) {
  return (
    <nav
      className={cn(
        "sticky top-0 bg-white drop-shadow-sm h-[80px] flex justify-center items-center",
        className
      )}
    >
      <h1 className="text-orange-500 text-lg font-extrabold">Logo app</h1>
    </nav>
  );
}
