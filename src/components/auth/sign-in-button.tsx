"use client";

import Link from "next/link";
import { Button, type ButtonProps } from "~/components/ui/button";

export default function SignInButton(props: ButtonProps) {
  return (
    <Link href="/sign-in" passHref>
      <Button variant="secondary" {...props}>
        Sign in
      </Button>
    </Link>
  );
}
