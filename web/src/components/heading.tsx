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

export const alignVariants = cva("", {
  variants: {
    align: {
      center: "text-center",
      left: "text-left",
      right: "text-right",
    },
  },
  defaultVariants: {
    align: "center",
  },
})

export interface HeadingProps
  extends VariantProps<typeof headingVariants>,
    VariantProps<typeof alignVariants> {
  className?: string
  children: React.ReactNode
}

export const Heading = ({ align, size, className, children }: HeadingProps) => {
  return (
    <h1 className={cn(alignVariants({ align }))}>
      <span className={cn(headingVariants({ size }), className)}>
        {children}
      </span>
    </h1>
  )
}
