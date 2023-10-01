import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

export const headingVariants = cva("bg-heading px-1 font-apfel font-bold", {
  variants: {
    size: {
      default: "text-4xl",
      sm: "text-3xl",
      lg: "text-5xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface HeadingProps extends VariantProps<typeof headingVariants> {
  children: React.ReactNode
}

export const Heading = ({ size, children }: HeadingProps) => {
  return (
    <h1 className="text-center">
      <span className={cn(headingVariants({ size }))}>{children}</span>
    </h1>
  )
}
