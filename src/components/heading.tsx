import { cva } from "class-variance-authority";

import { cn } from "~/utils/cn";

import type { VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";

const spanVariants = cva(
  "bg-gradient-to-t from-yellow-200 from-45% to-0% px-1 font-serif font-bold text-black dark:from-yellow-800 dark:text-white",
  {
    variants: {
      size: {
        sm: "text-2xl/none md:text-3xl",
        md: "text-3xl/none md:text-4xl",
        lg: "text-2xl/none md:text-5xl",
        xl: "text-6xl/none",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type HeadingProps = PropsWithChildren<
  {
    className?: { container?: string; children?: string };
  } & VariantProps<typeof spanVariants>
>;
export const Heading = ({ children, className, size }: HeadingProps) => (
  <div className={cn(className?.container)}>
    <span className={cn(spanVariants({ size }), className?.children)}>
      {children}
    </span>
  </div>
);
