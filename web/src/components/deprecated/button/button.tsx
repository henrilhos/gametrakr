"use client"

import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react"
import { AnimationProps, motion } from "framer-motion"
import { twMerge } from "tailwind-merge"

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  children: ReactNode
  variant?: "primary" | "secondary"
  icon?: boolean
  full?: boolean
  align?: "left" | "center" | "right"
}

const commonHoverClasses = twMerge(
  "hover:bg-white hover:text-black hover:inner-border-4 hover:inner-border-black",
  "active:text-yellow active:bg-yellow-200 active:inner-border-0",
  "dark:hover:bg-black dark:hover:text-white dark:hover:inner-border-4 dark:hover:inner-border-white",
  "dark:active:text-yellow dark:active:bg-yellow-700 dark:active:inner-border-0"
)

const primaryClasses = twMerge(
  "bg-yellow text-white",
  "dark:bg-yellow-300 dark:text-black",
  commonHoverClasses
)
const secondaryClasses = twMerge(
  "text-black-lighter bg-yellow-200",
  "dark:bg-yellow-700 dark:text-white",
  commonHoverClasses
)

const textClasses = twMerge("min-w-[10rem] px-5 py-3")
const iconClasses = twMerge("text-yellow h-full px-4", "dark:text-yellow")

const fullWidth = twMerge("w-full")

export const Button = ({
  onClick,
  children,
  full = false,
  icon = false,
  variant = "primary",
  className,
  align = "left",
}: Props) => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const alignClasses = ["text-left", "text-center", "text-right"]

  return (
    <motion.button
      whileHover={{ scale: 1.02 } as AnimationProps}
      whileTap={{ scale: 0.98 } as AnimationProps}
      className={twMerge(
        `rounded-2xl text-xl font-bold text-${align}`,
        variant === "primary" && primaryClasses,
        variant === "secondary" && secondaryClasses,
        icon ? iconClasses : textClasses,
        full && fullWidth,
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
