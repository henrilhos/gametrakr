"use client"

import React from "react"
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTheme } from "next-themes"
import { Heading } from "./heading"
import { Button } from "./ui/button"

export const Header = () => {
  const { theme, setTheme } = useTheme()

  return (
    <header className="mx-8 my-4 flex justify-between md:mx-16 md:my-8">
      <Heading>gametrakr</Heading>

      <div className="md:hidden">Celular</div>

      <div className="hidden gap-4 md:flex">
        <Button variant="secondary">Sign In</Button>
        <Button>Sign Up</Button>

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
    </header>
  )
}
