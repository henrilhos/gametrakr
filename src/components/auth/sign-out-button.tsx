"use client";

import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";
import { Button, type ButtonProps } from "~/components/ui/button";

export default function SignOutButton(props: ButtonProps) {
  return (
    <Button
      variant="icon"
      size="icon"
      aria-label="Sign out"
      justify="center"
      onClick={() => void signOut()}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center">
        <FontAwesomeIcon icon={faRightFromBracket} />
        <span className="sr-only">Sign out</span>
      </div>
    </Button>
  );
}
