import { cva } from "class-variance-authority";

import { cn } from "~/utils/cn";

import type { VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";

const headingVariants = cva("", {
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    align: "center",
  },
});

const spanVariants = cva("bg-heading px-1 font-apfel font-bold", {
  variants: {
    size: {
      sm: "text-2xl md:text-3xl",
      md: "text-3xl md:text-4xl",
      lg: "text-4xl md:text-5xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type HeadingProps = PropsWithChildren<
  { className?: string } & VariantProps<typeof headingVariants> &
    VariantProps<typeof spanVariants>
>;
export const Heading = ({ align, children, className, size }: HeadingProps) => (
  <h3 className={cn(headingVariants({ align }))}>
    <span className={cn(spanVariants({ size }), className)}>{children}</span>
  </h3>
);
