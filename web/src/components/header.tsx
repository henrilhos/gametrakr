"use client"

import React from "react"
import Link from "next/link"
import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTheme } from "next-themes"
import { AuthDialog, SignInForm, SignUpForm } from "./auth"
import { Heading } from "./heading"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

export const Header = () => {
  const { theme, setTheme } = useTheme()
  const [openSignUpDialog, setOpenSignUpDialog] = React.useState(false)
  const [openSignInDialog, setOpenSignInDialog] = React.useState(false)

  return (
    <header className="mx-8 my-4 flex justify-between md:mx-16 md:my-8">
      <Link href="/">
        <Heading className="select-none">gametrakr</Heading>
      </Link>

      <div className="inline-flex items-center md:hidden">
        <Sheet>
          <SheetTrigger>
            <FontAwesomeIcon size="2xl" icon={faBars} />
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <Heading align="left" size="sm">
                  gametrakr
                </Heading>
              </SheetTitle>
            </SheetHeader>
            <div className="full-height-sheet flex flex-col-reverse gap-4">
              <SheetClose>
                <Button
                  asChild
                  className="min-w-full"
                  onClick={() => setOpenSignUpDialog(true)}
                >
                  Sign Up
                </Button>
              </SheetClose>
              <SheetClose>
                <Button
                  asChild
                  className="min-w-full"
                  onClick={() => setOpenSignInDialog(true)}
                  variant="secondary"
                >
                  Sign In
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden gap-4 md:flex">
        <Button onClick={() => setOpenSignInDialog(true)} variant="secondary">
          Sign In
        </Button>
        <Button onClick={() => setOpenSignUpDialog(true)}>Sign Up</Button>

        <Button
          className="ml-4"
          variant="icon"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <FontAwesomeIcon
            className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            icon={faSun}
          />
          <FontAwesomeIcon
            className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            icon={faMoon}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <AuthDialog
        open={openSignInDialog}
        onClose={() => setOpenSignInDialog(false)}
      >
        <SignInForm />
      </AuthDialog>
      <AuthDialog
        open={openSignUpDialog}
        onClose={() => setOpenSignUpDialog(false)}
      >
        <SignUpForm />
      </AuthDialog>
    </header>
  )
}
