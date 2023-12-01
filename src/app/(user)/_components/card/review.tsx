import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow, getYear } from "date-fns";
import { filterXSS } from "xss";
import { cn } from "~/lib/utils";

const getRatingStyle = (
  rating: number,
  representation: "text" | "background" = "text",
) => {
  switch (true) {
    case rating < 3:
      return representation === "text"
        ? "text-red-500"
        : "bg-red-500 dark:bg-red-500";
    case rating < 5:
      return representation === "text"
        ? "text-orange-500"
        : "bg-orange-500 dark:bg-orange-500";
    case rating < 7:
      return representation === "text"
        ? "text-yellow-500"
        : "bg-yellow-500 dark:bg-yellow-500";
    case rating < 9:
      return representation === "text"
        ? "text-green-500"
        : "bg-green-500 dark:bg-green-500";
    case rating <= 10:
      return representation === "text"
        ? "text-teal-500"
        : "bg-teal-500 dark:bg-teal-500";
    default:
      return representation === "text"
        ? "text-white"
        : "bg-white dark:bg-black";
  }
};

function Rating({ rating }: { rating: number }) {
  const left =
    rating === 0
      ? `0%`
      : rating < 10
      ? `calc(${rating * 10}% - 19px)`
      : `calc(${rating * 10}% - 24px)`;

  return (
    <div className="relative w-fit">
      <span
        className={cn("absolute left-0 font-bold", getRatingStyle(rating))}
        style={{ left }}
      >
        {rating * 10}
      </span>

      <div className="flex gap-0.5 pt-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-4 bg-neutral-200 first:rounded-s last:rounded-e dark:bg-black",
              rating > i && getRatingStyle(i + 1, "background"),
            )}
          />
        ))}
      </div>
    </div>
  );
}

type Props = {
  game: {
    name: string;
    slug: string;
    cover: string | null;
    releaseDate: Date | null;
  };
  review: {
    createdAt: Date;
    rating: number | null;
    content: string | null;
    isSpoiler: boolean;
  };
  user: {
    username: string;
    profileImage: string | null;
  };
};

export default function Review({ game, review, user }: Props) {
  const [showMore, setShowMore] = useState(false);

  const preview = review.content
    ?.split("</p>")
    .map((c) => c.replace("<p>", ""))
    .filter((c) => !!c);

  return (
    <div
      className={
        "space-y-4 rounded-2xl bg-white py-2 pl-2 pr-4 dark:bg-neutral-900"
      }
    >
      <div className="flex items-center">
        <div className="relative mr-2 h-8 w-8 rounded-full bg-neutral-100 p-[1px] dark:bg-neutral-950">
          <Image
            alt={`${user.username}'s profile picture`}
            src={user.profileImage ?? "/images/not-found-square.png"}
            width={32}
            height={32}
            className="h-full w-full rounded-full"
          />
        </div>

        <div className="flex grow flex-col md:flex-row">
          <div>
            <span className="font-bold">{user.username}</span>
            <span className="text-neutral-700 dark:text-neutral-500">
              &nbsp;logged a new game
            </span>
          </div>

          <div className="grow text-neutral-700 dark:text-neutral-500 md:text-right">
            {formatDistanceToNow(review.createdAt, {
              addSuffix: false,
            })}
          </div>
        </div>
      </div>

      <div className="ml-2 flex gap-4">
        <div className="relative aspect-game-cover h-36 min-w-fit rounded-md">
          <Image
            src={game.cover ?? "/images/not-found.png"}
            alt={game.name}
            sizes="108px"
            fill
            className="h-auto rounded-md"
          />
        </div>

        <div className="grow">
          <Link
            href={`/games/${game.slug}`}
            className="text-xl font-bold hover:underline"
          >
            {game.name}
          </Link>
          {game.releaseDate && (
            <div className="text-neutral-700 dark:text-neutral-500">
              {getYear(game.releaseDate)}
            </div>
          )}

          {review.rating && (
            <div className="mt-2">
              <Rating rating={review.rating} />
            </div>
          )}
        </div>
      </div>

      {review.content && preview?.[0] && (
        <div
          className="prose px-2 dark:prose-invert"
          dangerouslySetInnerHTML={{
            __html: filterXSS(showMore ? review.content : preview[0]),
          }}
        />
      )}

      {preview && preview.length > 1 && (
        <div className="px-2 pb-2">
          <button
            type="button"
            className="font-bold hover:underline"
            onClick={() => setShowMore((prev) => !prev)}
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        </div>
      )}
    </div>
  );
}
