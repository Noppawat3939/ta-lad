import { useEffect } from "react";

type UseShortcutKeyProps = { callback: <T>(arg?: T) => void };

export default function useShortcutKey({ callback }: UseShortcutKeyProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ([e.metaKey, e.ctrlKey].some(Boolean) && e.key === "k") {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}
