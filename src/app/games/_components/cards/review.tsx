import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
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
  return (
    <div className="flex w-fit items-center">
      <div className="flex gap-0.5">
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

      <span className={cn("ml-2 font-bold", getRatingStyle(rating))}>
        {rating * 10}
      </span>
    </div>
  );
}

type Props = {
  review: {
    createdAt: Date;
    content: string | null;
    rating: number | null;
    isSpoiler: boolean;
  };
  user: { username: string; profileImage: string | null };
};

export default function Review({ review, user }: Props) {
  const [showMore, setShowMore] = useState(false);

  const preview = review.content
    ?.split("</p>")
    .map((c) => c.replace("<p>", ""))
    .filter((c) => !!c);

  return (
    <div className="space-y-6 rounded-2xl bg-white pb-6 pl-2 pr-4 pt-2 dark:bg-neutral-900">
      <div className="flex items-center">
        <Link
          href={`/${user.username}`}
          className="first-letter relative mr-2 h-12 w-12 rounded-full bg-neutral-100 p-[1px] dark:bg-neutral-950"
        >
          <Image
            alt={`${user.username}'s profile picture`}
            src={user.profileImage ?? "/images/not-found-square.png"}
            width={48}
            height={48}
            className="aspect-square h-full w-full rounded-full"
          />
        </Link>

        <div className="flex grow flex-col md:flex-row">
          <div>
            <div>
              <Link
                href={`/${user.username}`}
                className="font-bold hover:underline"
              >
                {user.username}
              </Link>
              <span className="text-neutral-700 dark:text-neutral-500">
                &nbsp;logged a new game
              </span>
            </div>

            {review.rating && <Rating rating={review.rating} />}
          </div>

          <div className="grow text-neutral-700 dark:text-neutral-500 md:text-right">
            {formatDistanceToNow(review.createdAt, {
              addSuffix: false,
            })}
          </div>
        </div>
      </div>

      {review.content && preview?.[0] && (
        <div
          className="prose px-2 dark:prose-invert md:pl-14"
          dangerouslySetInnerHTML={{
            __html: filterXSS(showMore ? review.content : preview[0]),
          }}
        />
      )}

      {preview && preview.length > 1 && (
        <div className="px-2 pb-2 md:pl-14">
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
