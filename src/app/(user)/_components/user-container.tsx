"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { formatDistanceToNow, getYear } from "date-fns";
import { type User } from "next-auth";
import { filterXSS } from "xss";
import EditProfile from "~/app/(user)/_components/edit-profile";
import Follows from "~/app/(user)/_components/follows";
import ToggleFollow from "~/app/(user)/_components/toggle-follow-button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type BasicInformationProps = {
  username: string;
  location?: string | null;
  bio?: string | null;
};

function BasicInformation(props: BasicInformationProps) {
  return (
    <div>
      <div className="text-xl/none font-bold text-yellow-500 dark:text-yellow-400">
        {props.username}
      </div>

      {props.location && (
        <div className="mt-2 text-base/none text-neutral-600 dark:text-neutral-700">
          {props.location}
        </div>
      )}

      {props.bio && (
        <div className="mt-6 text-neutral-700 dark:text-neutral-600">
          {props.bio}
        </div>
      )}
    </div>
  );
}

type Props = { user?: User };

export default function UserContainer({ user: currentUser }: Props) {
  const { username } = useParams<{ username: string }>();
  const [user] = api.user.findFirstByUsername.useSuspenseQuery(
    { username },
    { refetchOnWindowFocus: false },
  );

  if (!user) return notFound();

  return (
    <div className="flex flex-col gap-8">
      <div
        className={cn(
          "relative aspect-cover w-full rounded-t-lg bg-yellow-500 dark:bg-yellow-400 md:rounded-4xl",
          user.coverImage && "bg-transparent dark:bg-transparent",
        )}
      >
        {user.coverImage && (
          <Image
            alt={`${user.username}'s cover picture`}
            src={user.coverImage}
            objectFit="cover"
            className="rounded-t-lg md:rounded-4xl"
            fill
          />
        )}
      </div>

      <div className="z-0 -mt-8 grid grid-cols-10 gap-4 md:-mt-20 md:px-8 md:pb-8">
        <div className="col-span-10 flex h-fit flex-col rounded-b-lg bg-neutral-50 p-4 dark:bg-neutral-950 md:col-span-3 md:rounded-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-1 -mt-14 flex aspect-square w-1/2 md:-mt-24 md:w-full">
              <div className="h-auto w-full rounded-4xl bg-neutral-50 p-1 dark:bg-neutral-950">
                <Image
                  alt={`${user.username}'s profile picture`}
                  src={user.profileImage ?? "/images/not-found-square.png"}
                  width={200}
                  height={200}
                  className="h-full w-full rounded-[28px] object-cover"
                />
              </div>
            </div>
            <div className="col-span-1 flex justify-end">
              {currentUser && currentUser.id === user.id && (
                <EditProfile user={{ ...user }} />
              )}

              {currentUser && currentUser.id !== user.id && (
                <ToggleFollow
                  id={user.id}
                  username={user.username}
                  variant={user.isFollowing ? "secondary" : "primary"}
                />
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-4">
            <BasicInformation {...user} />

            <div className="grid w-full grid-cols-2 gap-2 xl:grid-cols-4">
              <div className="col-span-1 hidden xl:block" />

              <Follows
                followers={user.followers}
                following={user.following}
                userId={user.id}
                username={user.username}
                currentUserId={currentUser?.id}
              />
            </div>
          </div>
        </div>

        {user.reviews.length > 0 && (
          <div className="col-span-5 flex h-fit flex-col gap-4 rounded-2xl p-4 dark:bg-neutral-950">
            {user.reviews.map((review, i) => (
              <div
                key={i}
                className={
                  "space-y-4 rounded-2xl py-2 pl-2 pr-4 dark:bg-neutral-900"
                }
              >
                <div className="flex items-center">
                  <div className="relative mr-2 h-8 w-8 rounded-full p-[1px] dark:bg-neutral-950">
                    <Image
                      alt={`${user.username}'s profile picture`}
                      src={user.profileImage ?? "/images/not-found-square.png"}
                      width={32}
                      height={32}
                      className="h-full w-full rounded-full"
                    />
                  </div>

                  <span className="font-bold dark:text-white">
                    {user.username}
                  </span>
                  <span className="dark:text-neutral-500">
                    &nbsp;logged a new game
                  </span>

                  <div className="grow text-right dark:text-neutral-500">
                    {formatDistanceToNow(review.createdAt, {
                      addSuffix: false,
                    })}
                  </div>
                </div>

                <div className="ml-2 flex gap-4">
                  <div className="relative aspect-game-cover h-36 min-w-fit rounded-md">
                    <Image
                      src={review.game.cover ?? "/images/not-found.png"}
                      alt={review.game.name}
                      fill
                      className="h-auto rounded-md"
                    />
                  </div>

                  <div>
                    <div className="text-xl font-bold dark:text-white">
                      {review.game.name}
                    </div>
                    {review.game.releaseDate && (
                      <div className="dark:text-neutral-500">
                        {getYear(review.game.releaseDate)}
                      </div>
                    )}
                  </div>
                </div>

                {review.content && (
                  <div
                    className="prose px-2 pb-2 dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: filterXSS(review.content),
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
