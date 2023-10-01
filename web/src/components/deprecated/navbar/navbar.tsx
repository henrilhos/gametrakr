// 'use client'

import { useState } from "react"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "../button"
import { Title } from "../title"
import { ToggleThemeButton } from "../toggle-theme-button"

export const Navbar = () => {
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false)

  return (
    <div className="mx-8 my-4 flex justify-between md:mx-16 md:my-8">
      <Title classes="text-4xl">gametrakr</Title>
      {/* TODO: add mobile menu */}
      <div className="inline-flex items-center md:hidden">
        <FontAwesomeIcon icon={faBars} size="xl" />
      </div>
      <div className="hidden gap-4 md:flex">
        {/* TODO: add games / community / search bar */}
        <Button variant="secondary">Sign In</Button>
        <Button onClick={() => setSignUpModalOpen(true)}>Sign Up</Button>
        <ToggleThemeButton />
      </div>
      {/* <Modal
        open={isSignUpModalOpen}
        onClose={() => setSignUpModalOpen(false)}
      /> */}
    </div>
  )
}
