"use client";

import { signIn } from "next-auth/react";
import { Button, type ButtonProps } from "~/components/ui/button";

export default function SignInButton(props: ButtonProps) {
  return (
    <Button variant="secondary" onClick={() => void signIn()} {...props}>
      Sign in
    </Button>
  );
}
