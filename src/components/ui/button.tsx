import React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "~/utils/cn";

import type { VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "items-center rounded-2xl text-xl font-bold leading-6 transition-all hover:scale-105 hover:bg-background hover:text-foreground hover:inner-border-4 hover:inner-border-foreground active:scale-95 active:bg-accent active:text-accent-foreground active:inner-border-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        // destructive:
        //   "hover:bg-destructive/90 bg-destructive text-destructive-foreground",
        // outline:
        //   "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        icon: "inline-flex justify-center bg-secondary text-secondary-foreground",
        // ghost: "hover:bg-accent hover:text-accent-foreground",
        // link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "px-4 py-2 text-lg",
        md: "min-w-[10rem] px-5 py-3",
        lg: "min-w-[13rem] px-5 py-3",
        icon: "h-full px-3.5 text-accent-foreground",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      align: "left",
    },
  },
);

type ButtonProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, align, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, align, className }),
          props.disabled && "bg-destructive",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
