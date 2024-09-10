"use client";

import { Image, cn } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

type ImageSliderProps = {
  images: string[];
  height?: number;
};

export default function ImageSlider({ images, height }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDecreaseIndex = useCallback(
    () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length),
    []
  );

  const handleIncreaseIndex = useCallback(
    () => setCurrentIndex((prev) => (prev + 1) % images.length),
    []
  );

  const hasOneImage = useMemo(() => images.length <= 1, [images]);

  return (
    <div>
      <Image
        height={height || 240}
        className="object-cover w-full z-[1]"
        src={images[currentIndex]}
        alt="image-slider"
      />
      <button
        className={cn(
          "absolute left-0 top-1/2 transition-all duration-200 hover:opacity-70",
          hasOneImage ? "hidden" : undefined
        )}
        onClick={handleDecreaseIndex}
      >
        <ChevronLeft className="text-gray-400" />
      </button>
      <button
        className={cn(
          "absolute right-0 top-1/2 transition-all duration-200 hover:opacity-70",
          hasOneImage ? "hidden" : undefined
        )}
        onClick={handleIncreaseIndex}
      >
        <ChevronRight className="text-gray-400" />
      </button>
    </div>
  );
}
