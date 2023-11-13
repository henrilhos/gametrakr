import { type PropsWithChildren } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const headingVariants = cva(
  "bg-gradient-to-t from-yellow-200 from-45% to-0% px-1 font-apfel-grotezk font-bold text-black dark:from-yellow-800 dark:text-white",
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

export interface HeadingProps
  extends PropsWithChildren,
    VariantProps<typeof headingVariants> {
  className?: { container?: string; heading?: string };
}

export default function Heading({ children, size, className }: HeadingProps) {
  return (
    <div className={cn(className?.container)}>
      <span
        className={cn(headingVariants({ size, className: className?.heading }))}
      >
        {children}
      </span>
    </div>
  );
}
