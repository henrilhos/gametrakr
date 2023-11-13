import Image from "next/image";
import { pluralize } from "~/lib/utils";

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
    <div className="rounded-2xl border-2 border-neutral-100 bg-white p-3 dark:border-neutral-950 dark:bg-neutral-950">
      <div className="relative h-20 w-full">
        {/* <Image
          alt={`${user.username}'s cover picture`}
          src={user.coverImage ?? "/images/not-found.png"}
          objectFit="cover"
          className="z-0 rounded-lg"
          fill
        /> */}
        <div className="h-full w-full rounded-lg bg-yellow-500 dark:bg-yellow-400">
          &nbsp;
        </div>
      </div>
      <div className="mx-2 flex flex-row gap-2">
        <div className="relative z-10 -mt-8 h-[104px] w-[104px]">
          <Image
            alt={`${user.username}'s profile picture`}
            src={user.profileImage ?? "/images/not-found.png"}
            className="z-0 rounded-3xl border-4 border-white object-cover dark:border-neutral-950"
            fill
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
    </div>
  );
}
