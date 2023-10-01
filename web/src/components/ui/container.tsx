import React from "react"
import { cn } from "~/lib/utils"

export interface ContainerProps {
  className?: string
  children: React.ReactNode
}

export const Container = ({ className, children }: ContainerProps) => {
  return <div className={cn("md:px-16 md:pb-16", className)}>{children}</div>
}
