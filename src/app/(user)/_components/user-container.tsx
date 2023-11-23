"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { User } from "next-auth";
import EditProfile from "~/app/(user)/_components/edit-profile";
import ToggleFollowButton from "~/app/(user)/_components/toggle-follow-button";
import { api } from "~/trpc/react";

type Props = {
  user?: User;
};

export default function UserContainer({ user: currentUser }: Props) {
  const { username } = useParams<{ username: string }>();
  const [user] = api.user.findFirstByUsername.useSuspenseQuery({ username });

  if (!user) return notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="aspect-cover relative -z-10 w-full rounded-4xl bg-yellow-500 dark:bg-yellow-400">
        {user.coverImage && (
          <Image
            alt={`${user.username}'s cover picture`}
            src={user.coverImage}
            objectFit="cover"
            className="rounded-4xl"
            fill
          />
        )}
      </div>

      <div className="-mt-20 grid grid-cols-10 gap-4 px-8">
        <div className="col-span-3 flex h-fit flex-col items-center rounded-2xl p-4 dark:bg-neutral-950">
          <div className="relative -mt-24 flex w-full justify-center">
            <div className="aspect-square h-auto w-1/2 rounded-[40px] bg-neutral-950 p-2">
              <Image
                alt={`${user.username}'s profile picture`}
                src={user.profileImage ?? "/images/not-found.png"}
                width={200}
                height={200}
                className="h-full w-full rounded-[32px] object-cover"
              />
            </div>
          </div>

          <div className="text-xl font-bold dark:text-yellow-400">
            {user.username}
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {currentUser && currentUser.id === user.id && (
              <EditProfile user={user} />
            )}

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
