"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { type User } from "next-auth";
import EditProfile from "~/app/(user)/_components/edit-profile";
import ToggleFollowButton from "~/app/(user)/_components/toggle-follow-button";
import { api } from "~/trpc/react";

type Props = { user?: User };

export default function UserContainer({ user: currentUser }: Props) {
  const { username } = useParams<{ username: string }>();
  const [user] = api.user.findFirstByUsername.useSuspenseQuery({ username });

  if (!user) return notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="relative aspect-cover w-full rounded-t-lg bg-yellow-500 dark:bg-yellow-400 md:rounded-4xl">
        {user.coverImage && (
          <Image
            alt={`${user.username}'s cover picture`}
            src={user.coverImage}
            objectFit="cover"
            className=" rounded-t-lg md:rounded-4xl"
            fill
          />
        )}
      </div>

      <div className="z-0 -mt-8 grid grid-cols-10 gap-4 md:-mt-20 md:px-8">
        <div className="col-span-10 flex h-fit flex-col rounded-b-lg bg-neutral-50 p-4 dark:bg-neutral-950 md:col-span-3 md:rounded-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-1 -mt-14 flex aspect-square w-1/2 md:-mt-24 md:w-full">
              <div className="h-auto w-full rounded-4xl bg-neutral-50 p-1 dark:bg-neutral-950">
                <Image
                  alt={`${user.username}'s profile picture`}
                  src={user.profileImage ?? "/images/not-found.png"}
                  width={200}
                  height={200}
                  className="h-full w-full rounded-[28px] object-cover"
                />
              </div>
            </div>
            <div className="col-span-1 flex justify-end">
              {currentUser && currentUser.id === user.id && (
                <EditProfile user={user} />
              )}

              {currentUser && currentUser.id !== user.id && (
                <ToggleFollowButton
                  userId={user.id}
                  isFollowed={user.isFollowed}
                />
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-4">
            <div className="text-xl font-bold text-yellow-500 dark:text-yellow-400">
              {user.username}
            </div>

            <div className="grid w-full grid-cols-2 gap-2 xl:grid-cols-4">
              <div className="col-span-1 hidden md:block" />
              <div className="col-span-1 flex flex-col items-center justify-center rounded-2xl bg-white p-2 text-neutral-700 dark:bg-neutral-900">
                <div className="text-xl font-bold dark:text-white">
                  {user.following}
                </div>
                <div className="text-sm dark:text-neutral-600">Following</div>
              </div>
              <div className="col-span-1 flex flex-col items-center justify-center rounded-2xl bg-white p-2 text-neutral-700 dark:bg-neutral-900">
                <div className="text-xl font-bold dark:text-white">
                  {user.followers}
                </div>
                <div className="text-sm dark:text-neutral-600">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
