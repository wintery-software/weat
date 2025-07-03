"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { ComponentProps } from "react";

interface RatingProps {
  value: number;
  max?: number;
  color?: string;
  size?: number | string;
}

export const Rating = ({
  value,
  max = 5,
  color = "text-yellow-400",
  size = 20,
  className,
  ...rest
}: RatingProps & ComponentProps<"div">) => {
  const rating = Math.max(0, Math.min(value, max));
  const fullStars = Math.floor(rating);
  const hasPartial = rating - fullStars > 0.01;
  const partialWidth = hasPartial ? Math.round((rating - fullStars) * 100) : 0;
  const emptyStars = max - fullStars - (hasPartial ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)} {...rest}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={"full-" + i}
          className={cn(color)}
          style={{ width: size, height: size }}
          fill="currentColor"
          stroke="currentColor"
        />
      ))}
      {/* Partial star */}
      {hasPartial && (
        <span
          style={{
            position: "relative",
            display: "inline-block",
            width: size,
            height: size,
          }}
        >
          {/* Gray star (background) */}
          <Star
            className={cn("text-gray-300")}
            style={{
              width: size,
              height: size,
              position: "absolute",
              left: 0,
              top: 0,
            }}
            fill="currentColor"
            stroke="currentColor"
          />
          {/* Colored partial star (foreground) */}
          <Star
            className={cn(color)}
            style={{
              width: size,
              height: size,
              position: "absolute",
              left: 0,
              top: 0,
              clipPath: `inset(0 ${100 - partialWidth}% 0 0)`,
            }}
            fill="currentColor"
            stroke="currentColor"
          />
        </span>
      )}
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={"empty-" + i}
          className={"text-gray-300"}
          style={{ width: size, height: size }}
          fill="currentColor"
          stroke="currentColor"
        />
      ))}
    </div>
  );
};
