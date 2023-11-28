"use client";

import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "~/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const ratings = [
    { max: 1, className: "bg-red-500" },
    { max: 2, className: "bg-red-500" },
    { max: 3, className: "bg-orange-500" },
    { max: 4, className: "bg-orange-500" },
    { max: 5, className: "bg-yellow-500" },
    { max: 6, className: "bg-yellow-500" },
    { max: 7, className: "bg-green-500" },
    { max: 8, className: "bg-green-500" },
    { max: 9, className: "bg-teal-500" },
    { max: 10, className: "bg-teal-500" },
  ];

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full">
        <span className="grid h-full grow grid-cols-10 gap-0.5">
          {ratings.map((r, i) => (
            <span
              key={i}
              className={cn(
                "first:rounded-s last:rounded-e",
                (props.value?.[0] ?? 0) >= r.max
                  ? r.className
                  : "bg-neutral-200 dark:bg-neutral-800",
              )}
            />
          ))}
        </span>
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-3.5 w-3.5 rounded-full shadow transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          ratings.find((r) => r.max === (props.value?.[0] ?? 0))?.className ??
            "bg-neutral-900 dark:bg-neutral-100",
        )}
      />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
