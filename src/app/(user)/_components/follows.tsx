import { useState } from "react";
import FollowsModal from "~/app/(user)/_components/modal/follows";
import { api } from "~/trpc/react";

type FollowCardProps = {
  count: number;
  tab: "following" | "followers";
  onClick: (t: "following" | "followers") => void;
};

function FollowCard(props: FollowCardProps) {
  return (
    <button
      type="button"
      className="col-span-1 flex flex-col items-center justify-center rounded-2xl bg-white p-2 text-neutral-700 dark:bg-neutral-900"
      onClick={() => props.onClick(props.tab)}
    >
      <div className="text-xl font-bold dark:text-white">{props.count}</div>
      <div className="text-sm capitalize dark:text-neutral-600">
        {props.tab}
      </div>
    </button>
  );
}

type Props = {
  followingCount: number;
  followersCount: number;
  username: string;
};

export default function Follows(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"following" | "followers">("following");
  const followingQuery = api.publicProfile.following.useInfiniteQuery(
    { username: props.username },
    {
      enabled: isOpen && tab === "following",
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    },
  );
  const followersQuery = api.publicProfile.followers.useInfiniteQuery(
    { username: props.username },
    {
      enabled: isOpen && tab === "followers",
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    },
  );

  const following = followingQuery.data?.pages.flatMap(
    (page) => page?.following ?? [],
  ) ?? [];
  const followers = followersQuery.data?.pages.flatMap(
    (page) => page?.followers ?? [],
  ) ?? [];

  const handleOpen = (t: "following" | "followers") => {
    setTab(t);
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <FollowCard
        count={props.followingCount}
        tab="following"
        onClick={handleOpen}
      />
      <FollowCard
        count={props.followersCount}
        tab="followers"
        onClick={handleOpen}
      />
      <FollowsModal
        tab={tab}
        username={props.username}
        open={isOpen}
        onClose={handleClose}
        following={following}
        followers={followers}
        fetchNextPage={
          tab === "following"
            ? () => void followingQuery.fetchNextPage()
            : () => void followersQuery.fetchNextPage()
        }
        hasNextPage={Boolean(
          tab === "following"
            ? followingQuery.hasNextPage
            : followersQuery.hasNextPage,
        )}
      />
    </>
  );
}
