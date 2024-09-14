import { useCallback, useState } from "react";

export default function useCount(initialCount?: number) {
  const [count, setCount] = useState(initialCount || 0);

  const onIncrease = useCallback(() => setCount((prev) => prev + 1), []);
  const onDecrease = useCallback(() => setCount((prev) => prev - 1), []);

  return { count, onDecrease, onIncrease };
}
