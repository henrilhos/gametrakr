"use client";

import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";

export default function MobileSignInButton() {
  return (
    <Button size="icon" justify="center" onClick={() => void signIn()}>
      <FontAwesomeIcon className="h-5" icon={faRightToBracket} />
    </Button>
  );
}
