import Image from "next/image";
import Link from "next/link";

import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { cn } from "~/utils/cn";

type GameCardProps = {
  developer?: string;
  image: string;
  name: string;
  rating: number;
  releaseYear?: number;
  slug: string;
  primary?: boolean;
};
export const GameCard = ({ primary = false, ...props }: GameCardProps) => {
  return (
    <Link
      href={`/game/${props.slug}`}
      className={cn(
        "flex h-full w-full grow gap-4 rounded-2xl border-2 border-neutral-100 bg-white p-3 dark:border-neutral-950 dark:bg-neutral-950",
        primary &&
          "border-yellow-100 bg-yellow-100 p-5 dark:border-yellow-900 dark:bg-yellow-900",
      )}
    >
      <div className={"relative aspect-game-cover min-w-fit overflow-hidden"}>
        <Image
          src={props.image ? props.image : "https://fakeimg.pl/80"}
          alt={props.name}
          fill
          objectFit="cover"
          className={cn(
            "relative rounded-lg border-2 border-neutral-100 dark:border-neutral-900",
            primary && "border-yellow-200 dark:border-yellow-950",
          )}
        />
      </div>

      <div
        className={cn(
          "flex h-full min-w-0 flex-col justify-between",
          primary && "py-2",
          !primary && "gap-6",
        )}
      >
        <div className={cn("flex flex-col gap-2", primary && "gap-4")}>
          <div
            className={cn(
              "text-neutral-600 dark:text-neutral-400",
              primary && "text-lg",
            )}
          >
            <FontAwesomeIcon
              icon={faStar}
              className={"mr-1 text-yellow-500 dark:text-yellow-400"}
            />
            <span className="font-bold">96</span>
            <span className={cn("text-sm", primary && "text-base")}>/100</span>
          </div>

          <div
            className={cn(
              "font-serif font-bold",
              primary && "text-3xl/tight",
              !primary && "truncate",
            )}
          >
            {props.name}
          </div>
        </div>

        <div
          className={cn(
            "text-sm text-neutral-700 dark:text-neutral-300",
            primary && "text-base",
          )}
        >
          <div className="truncate">{props.releaseYear ?? "N/A"}</div>
          <div className="truncate">{props.developer ?? "N/A"}</div>
        </div>
      </div>
    </Link>
  );
};
