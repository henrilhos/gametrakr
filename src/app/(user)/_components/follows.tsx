import { useState } from "react";
import FollowsModal, {
  type Follow,
} from "~/app/(user)/_components/modal/follows";

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
  following: Follow[];
  followers: Follow[];
  userId: string;
  username: string;
  currentUserId?: string;
};

export default function Follows(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"following" | "followers">("following");

  const handleOpen = (t: "following" | "followers") => {
    setTab(t);
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <FollowCard
        count={props.following.length}
        tab="following"
        onClick={handleOpen}
      />
      <FollowCard
        count={props.followers.length}
        tab="followers"
        onClick={handleOpen}
      />
      <FollowsModal
        tab={tab}
        following={props.following}
        followers={props.followers}
        currentUserId={props.currentUserId}
        username={props.username}
        open={isOpen}
        onClose={handleClose}
      />
    </>
  );
}
