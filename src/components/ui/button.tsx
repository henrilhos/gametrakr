import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center rounded-xl text-lg font-bold ring-offset-white transition-all hover:scale-105 hover:bg-white hover:text-black hover:inner-border-4 hover:inner-border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 active:scale-95 active:bg-yellow-200 active:text-yellow-500 active:inner-border-0 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:hover:bg-black dark:hover:text-white dark:hover:inner-border-white dark:focus-visible:ring-slate-300 dark:active:bg-yellow-800 dark:active:text-yellow-400 md:rounded-2xl md:text-xl",
  {
    variants: {
      variant: {
        primary: "bg-yellow-500 text-white dark:bg-yellow-400 dark:text-black",
        secondary:
          "bg-yellow-200 text-black dark:bg-yellow-800 dark:text-white",
        icon: "bg-yellow-50 text-yellow-500 dark:bg-yellow-900 dark:text-yellow-400",
      },
      size: {
        md: "h-10 min-w-[160px] px-5 md:h-12",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10 md:h-12 md:w-12",
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  full?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      justify,
      full = false,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, justify, className }),
          full && "w-full",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
