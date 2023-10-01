import React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

const labelVariants = cva(
  "pl-5 text-sm leading-none text-black peer-disabled:cursor-not-allowed"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, children, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    >
      {children}
    </LabelPrimitive.Root>
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
