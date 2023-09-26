'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

type Props = {
  children: ReactNode
}

export const Providers = ({ children }: Props) => {
  return <ThemeProvider attribute='class'>{children}</ThemeProvider>
}
