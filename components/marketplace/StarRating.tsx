"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const SIZE_PX: Record<string, number> = { sm: 12, md: 16, lg: 22 };

export default function StarRating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const px = SIZE_PX[size] ?? 16;
  const display = interactive && hovered > 0 ? hovered : Math.round(value);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const filled = star <= display;
        return interactive ? (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
          >
            <Star
              size={px}
              className={filled ? "fill-lk-yellow text-lk-yellow" : "fill-none text-lk-neutral-mid"}
            />
          </button>
        ) : (
          <Star
            key={star}
            size={px}
            className={filled ? "fill-lk-yellow text-lk-yellow" : "fill-none text-lk-dark/20"}
          />
        );
      })}
    </div>
  );
}
