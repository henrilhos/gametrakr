import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

export const buttonVariants = cva(
  "items-center rounded-2xl text-xl font-bold transition-all hover:scale-105 hover:bg-background hover:text-foreground hover:inner-border-4 hover:inner-border-foreground active:scale-95 active:bg-accent active:text-accent-foreground active:inner-border-0",
  // "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
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
        default: "min-w-[10rem] px-5 py-3",
        // sm: "h-9 rounded-md px-3",
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
      variant: "default",
      size: "default",
      align: "left",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, align, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, align, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
