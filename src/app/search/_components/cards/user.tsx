import Image from "next/image";
import Link from "next/link";
import { cn, pluralize } from "~/lib/utils";

type Props = {
  user: {
    username: string;
    profileImage: string | null;
    coverImage: string | null;
    followersCount: number;
    followsCount: number;
  };
};

export default function UserCard({ user }: Props) {
  const followers = pluralize("followers", "follower");

  return (
    <Link
      href={`/${user.username}`}
      className="rounded-2xl border-2 border-neutral-100 bg-white p-3 dark:border-neutral-950 dark:bg-neutral-950"
    >
      <div
        className={cn(
          "relative aspect-cover w-full rounded-lg bg-yellow-500 dark:bg-yellow-400",
          user.coverImage && "bg-transparent dark:bg-transparent",
        )}
      >
        {user.coverImage && (
          <Image
            alt={`${user.username}'s cover picture`}
            src={user.coverImage}
            className="rounded-lg object-cover"
            fill
          />
        )}
      </div>
      <div className="mx-2 flex flex-row gap-2">
        <div className="relative -mt-8 aspect-square h-[104px] w-[104px] rounded-3xl bg-white p-1 dark:bg-neutral-950">
          <Image
            alt={`${user.username}'s profile picture`}
            src={user.profileImage ?? "/images/not-found-square.png"}
            width={96}
            height={96}
            className="h-full w-full rounded-[20px] object-cover"
          />
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <div className="text-lg font-bold">{user.username}</div>
          <div className="flex gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <div>
              <span className="font-bold">{user.followersCount}</span>{" "}
              <span>{followers(user.followersCount)}</span>
            </div>
            <div>
              <span className="font-bold">{user.followsCount}</span>{" "}
              <span>following</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
