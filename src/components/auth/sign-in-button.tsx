"use client";

import Link from "next/link";
import { Button, type ButtonProps } from "~/components/ui/button";

export default function SignInButton(props: ButtonProps) {
  return (
    <Button variant="secondary" {...props}>
      <Link href="/sign-in" passHref>
        Sign in
      </Link>
    </Button>
  );
}
