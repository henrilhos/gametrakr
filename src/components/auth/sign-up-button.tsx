"use client";

import Link from "next/link";
import { Button, type ButtonProps } from "~/components/ui/button";

export default function SignUpButton({
  content = "Sign up",
  ...props
}: ButtonProps) {
  return (
    <Button {...props}>
      <Link href="/sign-up" passHref>
        {content}
      </Link>
    </Button>
  );
}
