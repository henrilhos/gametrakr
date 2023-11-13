"use client";

import { signOut } from "next-auth/react";
import { Button, type ButtonProps } from "~/components/ui/button";

export default function SignOutButton(props: ButtonProps) {
  return (
    <Button variant="secondary" onClick={() => void signOut()} {...props}>
      Sign out
    </Button>
  );
}
