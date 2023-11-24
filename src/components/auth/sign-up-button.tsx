"use client";

import Link from "next/link";
import { Button, type ButtonProps } from "~/components/ui/button";

export default function SignUpButton({
  content = "Sign up",
  ...props
}: ButtonProps) {
  return (
    <Link href="/sign-up" passHref>
      <Button {...props}>{content}</Button>
    </Link>
  );
}
