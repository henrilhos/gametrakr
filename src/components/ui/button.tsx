import React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "~/utils/cn";

import type { VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center rounded-2xl text-xl font-bold ring-offset-white transition-all hover:scale-105 hover:bg-white hover:text-black hover:inner-border-4 hover:inner-border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 active:scale-95 active:bg-yellow-200 active:text-yellow-500 active:inner-border-0 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:hover:bg-black dark:hover:text-white dark:hover:inner-border-white dark:focus-visible:ring-slate-300 dark:active:bg-yellow-800 dark:active:text-yellow-400",
  {
    variants: {
      variant: {
        primary: "bg-yellow-500 text-white dark:bg-yellow-400 dark:text-black",
        secondary:
          "bg-yellow-200 text-black dark:bg-yellow-800 dark:text-white",
        icon: "bg-yellow-50 text-yellow-500 dark:bg-yellow-900 dark:text-yellow-400",
      },
      size: {
        md: "h-12 px-5 py-3",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-12 w-12",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      justify: "start",
    },
  },
);

type ButtonProps = {
  as?: "a" | "button";
  full?: boolean;
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>;
export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      justify,
      as = "button",
      full = false,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : as;
    const btnProps = { ...ref, ...props };

    return (
      <Component
        className={cn(
          buttonVariants({ variant, size, justify, className }),
          full && "w-full",
        )}
        {...btnProps}
      />
    );
  },
);
Button.displayName = "Button";
