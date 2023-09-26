'use client'

import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import clsx from 'clsx'
import { AnimationProps, motion } from 'framer-motion'

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  icon?: boolean
  classes?: string
}

const commonHoverClasses = clsx(
  'hover:bg-white hover:text-black hover:inner-border-4 hover:inner-border-black',
  'active:bg-yellow-300 active:text-yellow active:inner-border-0',
  'dark:hover:bg-black dark:hover:text-white dark:hover:inner-border-4 dark:hover:inner-border-white',
  'dark:active:bg-yellow-800 dark:active:text-yellow dark:active:inner-border-0'
)

const primaryClasses = clsx(
  'bg-yellow text-white',
  'dark:bg-yellow-400 dark:text-black',
  commonHoverClasses
)
const secondaryClasses = clsx(
  'bg-yellow-300 text-black-lighter',
  'dark:bg-yellow-800 dark:text-white',
  commonHoverClasses
)

const textClasses = clsx('min-w-[10rem] px-5 py-3 text-left')
const iconClasses = clsx('px-4 h-full text-yellow', 'dark:text-yellow')

export const Button = ({
  children,
  variant = 'primary',
  icon = false,
  classes,
  onClick,
}: Props) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 } as AnimationProps}
      whileTap={{ scale: 0.9 } as AnimationProps}
      className={clsx(
        'rounded-2xl text-xl font-bold',
        variant === 'primary' && primaryClasses,
        variant === 'secondary' && secondaryClasses,
        icon ? iconClasses : textClasses,
        classes
      )}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
