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
        "inline-flex h-fit w-28 items-center justify-center rounded-xl bg-yellow-500 px-3 py-1 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-transparent hover:text-black hover:inner-border-2 hover:inner-border-black active:scale-95 active:bg-yellow-200 active:text-yellow-500 active:inner-border-0 dark:bg-yellow-400 dark:text-black dark:hover:bg-transparent dark:hover:text-white dark:hover:inner-border-white dark:active:bg-yellow-800 dark:active:text-yellow-400",
        isFollowed &&
          "before:content-['Following'] hover:bg-transparent hover:text-red-500 hover:inner-border-red-500 hover:before:content-['Unfollow'] dark:hover:bg-transparent dark:hover:text-red-400 dark:hover:inner-border-red-400",
        !isFollowed && "before:content-['Follow']",
      )}
    />
  );
}
