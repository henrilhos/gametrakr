import { type User } from "next-auth";
import ActionButtons from "~/app/games/_components/action-buttons";
import { type Game } from "~/app/games/_components/game";
import Rating from "~/app/games/_components/rating";
import { cn } from "~/lib/utils";

type Props = {
  user?: User;
  game: Game;
};

export default function Sidebar({ user, game }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-4xl bg-neutral-100 p-4 dark:bg-neutral-950 dark:text-neutral-600">
      {/* TODO: enable actions after finish user page and add modals */}
      <ActionButtons user={user} game={game} />

      <div className={cn("flex flex-col gap-4 px-2 pb-2", !user && "pt-2")}>
        <Rating criticRating={game.criticRating} userRating={game.userRating} />
      </div>
    </div>
  );
}
