import { type User } from "next-auth";
import Rating from "~/app/games/_components/rating";
import { cn } from "~/lib/utils";

type Props = {
  user?: User;
  userRating?: number;
  criticRating?: number;
};

export default function GameCard({ user, userRating, criticRating }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-4xl bg-yellow-50 p-4 dark:bg-neutral-950 dark:text-neutral-600">
      {/* TODO: enable actions after finish user page and add modals */}
      {/* <ActionButtons user={user} /> */}

      <div className={cn("flex flex-col gap-4 px-2 pb-2", !user && "pt-2")}>
        <Rating userRating={userRating} criticRating={criticRating} />
      </div>
    </div>
  );
}
