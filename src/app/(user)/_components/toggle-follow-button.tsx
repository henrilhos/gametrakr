"use client";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type Props = {
  userId: string;
  isFollowed: boolean;
};

export default function ToggleFollowButton({ userId, isFollowed }: Props) {
  const { mutateAsync: toggleFollow } = api.user.toggleFollow.useMutation();
  const utils = api.useUtils();

  const onClick = async () => {
    await toggleFollow({ userId });
    await utils.user.findFirstByUsername.invalidate();
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex w-full cursor-pointer items-center justify-start rounded-xl bg-yellow-500 px-5 text-lg font-bold text-white ring-offset-white transition-all hover:scale-105 hover:bg-transparent hover:text-black hover:inner-border-4 hover:inner-border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 active:scale-95 active:bg-yellow-200 active:text-yellow-500 active:inner-border-0 disabled:pointer-events-none disabled:opacity-50 dark:bg-yellow-400 dark:text-black dark:ring-offset-slate-950 dark:hover:bg-transparent dark:hover:text-white dark:hover:inner-border-white dark:focus-visible:ring-slate-300 dark:active:bg-yellow-800 dark:active:text-yellow-400 md:h-12 md:rounded-2xl md:text-xl",
        isFollowed &&
          "before:content-['Following'] hover:text-red-500 hover:inner-border-red-500 hover:before:content-['Unfollow'] dark:hover:text-red-400 dark:hover:inner-border-red-400",
        !isFollowed && "before:content-['Follow']",
      )}
    />
  );
}
