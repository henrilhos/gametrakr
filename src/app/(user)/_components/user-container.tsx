"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { User } from "next-auth";
import ToggleFollowButton from "~/app/(user)/_components/toggle-follow-button";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

type Props = {
  user?: User;
};

export default function UserContainer({ user: currentUser }: Props) {
  const { username } = useParams<{ username: string }>();
  const [user] = api.user.findFirstByUsername.useSuspenseQuery({ username });

  if (!user) return notFound();

  const updateFollowing = (addedFollow: boolean) => {
    if (addedFollow && !user.isFollowed) {
      user.isFollowed = true;
      user.followers += 1;
    }

    if (!addedFollow && user.isFollowed) {
      user.isFollowed = false;
      user.followers -= 1;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="aspect-cover w-full rounded-4xl bg-yellow-500" />

      <div className="-mt-20 grid grid-cols-10 gap-4 px-8">
        <div className="col-span-3 flex h-fit flex-col items-center rounded-2xl p-4 dark:bg-neutral-950">
          <div className="relative -mt-24 flex w-full justify-center">
            <div className="aspect-square h-auto w-1/2 rounded-[40px] bg-neutral-950 p-2">
              <Image
                alt={user.username}
                src={user.profileImage ?? "/images/not-found.png"}
                width={200}
                height={200}
                className="h-full w-full rounded-[40px] object-cover"
              />
            </div>
          </div>

          <div className="text-xl font-bold dark:text-yellow-400">
            {user.username}
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {currentUser && currentUser.id !== user.id && (
              <ToggleFollowButton
                userId={user.id}
                isFollowed={user.isFollowed}
              />
            )}

            <div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-4">
              <div className="col-span-1" />
              <div className="col-span-1 flex flex-col items-center justify-center rounded-2xl p-2 dark:bg-neutral-900">
                <div className="text-xl font-bold">{user.following}</div>
                <div className="text-sm dark:text-neutral-600">Following</div>
              </div>
              <div className="col-span-1 flex flex-col items-center justify-center rounded-2xl p-2 dark:bg-neutral-900">
                <div className="text-xl font-bold">{user.followers}</div>
                <div className="text-sm dark:text-neutral-600">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
