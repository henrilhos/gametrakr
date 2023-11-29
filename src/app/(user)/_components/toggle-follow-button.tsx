"use client";

import { type MouseEvent } from "react";
import { track } from "@vercel/analytics";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const toggleFollowVariants = cva(
  "inline-flex items-center justify-center rounded-xl px-3 py-1 font-bold transition-all hover:scale-105 hover:inner-border-2 active:scale-95",
  {
    variants: {
      variant: {
        primary:
          "bg-yellow-500 text-white before:content-['Follow'] hover:bg-transparent hover:text-black hover:inner-border-black active:bg-yellow-200 active:text-yellow-500 active:inner-border-0 dark:bg-yellow-400 dark:text-black dark:hover:bg-transparent dark:hover:text-white dark:hover:inner-border-white dark:active:bg-yellow-800 dark:active:text-yellow-400",
        secondary:
          "text-neutral-600 inner-border-2 inner-border-neutral-600 before:content-['Following'] hover:bg-transparent hover:text-red-500 hover:inner-border-red-500 hover:before:content-['Unfollow'] dark:text-neutral-600 dark:inner-border-neutral-600 dark:hover:bg-transparent dark:hover:text-red-400 dark:hover:inner-border-red-400",
      },
      size: {
        md: "h-fit w-28 text-lg",
        sm: "h-8 w-24 text-base/none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ToggleFollowProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleFollowVariants> {
  id: string;
  username: string;
}

export default function ToggleFollow({
  id,
  size,
  username,
  variant,
}: ToggleFollowProps) {
  const { mutateAsync: toggleFollow } = api.user.toggleFollow.useMutation();
  const utils = api.useUtils();

  const onClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    track("(Un)Follow user", { id });
    await toggleFollow({ userId: id });
    await utils.user.findFirstByUsername.invalidate({ username });
  };

  return (
    <button
      onClick={(e) => onClick(e)}
      className={cn(toggleFollowVariants({ size, variant }))}
    />
  );
}
