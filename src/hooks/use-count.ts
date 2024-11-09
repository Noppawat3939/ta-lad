import { useCallback, useState } from "react";

export default function useCount(
  initialCount?: number,
  initialCountList?: number[]
) {
  const [count, setCount] = useState(initialCount || 0);
  const [countList, setCountList] = useState<number[]>(initialCountList || []);

  const onIncrease = useCallback(() => setCount((prev) => prev + 1), []);
  const onDecrease = useCallback(() => setCount((prev) => prev - 1), []);
  const onReset = useCallback(() => setCount(1), []);

  const onIncreaseList = useCallback(
    (updateIndex: number) =>
      setCountList((prev) =>
        prev.length > 0 || updateIndex > countList.length
          ? prev.map((v, i) => (i === updateIndex ? v + 1 : v))
          : []
      ),
    []
  );

  const onDecreaseList = useCallback(
    (updateIndex: number) =>
      setCountList((prev) =>
        prev.length > 0 || updateIndex > countList.length
          ? prev.map((v, i) => (i === updateIndex ? v - 1 : v))
          : []
      ),
    []
  );

  return {
    count,
    onDecrease,
    onIncrease,
    onReset,
    countList,
    onIncreaseList,
    onDecreaseList,
    setCountList,
  };
}
