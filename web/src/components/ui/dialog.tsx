"use client"

import React from "react"
import { Dialog as PrimitiveDialog, Transition } from "@headlessui/react"
import { cn } from "~/lib/utils"

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose: () => void
  backgroundClassName?: string
  children: React.ReactNode
  containerClassName?: string
  open: boolean
}

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      onClose,
      backgroundClassName,
      children,
      className,
      containerClassName,
      open,
      ...props
    },
    ref
  ) => (
    <Transition.Root show={open} as={React.Fragment}>
      <PrimitiveDialog
        as="div"
        onClose={onClose}
        className={className}
        ref={ref}
        {...props}
      >
        <DialogBackground className={backgroundClassName} />

        <DialogContainer className={containerClassName}>
          {children}
        </DialogContainer>
      </PrimitiveDialog>
    </Transition.Root>
  )
)
Dialog.displayName = "Dialog"

interface DialogBackgroundProps {
  className?: string
}

const DialogBackground = ({ className }: DialogBackgroundProps) => (
  <Transition.Child
    as={React.Fragment}
    enter="ease-out duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div
      className={cn(
        "fixed inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity",
        className
      )}
    />
  </Transition.Child>
)

interface DialogContainerProps {
  children: React.ReactNode
  className?: string
}

const DialogContainer = ({ children, className }: DialogContainerProps) => (
  <div className="fixed inset-0 w-screen overflow-y-auto">
    <div
      className={cn(
        "flex min-h-full items-end justify-center text-center md:items-center",
        className
      )}
    >
      <Transition.Child
        as={React.Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <PrimitiveDialog.Panel>{children}</PrimitiveDialog.Panel>
      </Transition.Child>
    </div>
  </div>
)
