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
  className?: string;
};
export const GameCard = ({
  primary = false,
  className,
  ...props
}: GameCardProps) => {
  return (
    <Link
      href={`/game/${props.slug}`}
      className={cn(
        "flex grow gap-4 rounded-3xl border-2 border-neutral-100 bg-white p-4 dark:border-0 dark:bg-neutral-950",
        primary && "border-0 dark:bg-yellow-950",
        className,
      )}
    >
      <div
        className={cn(
          "aspect-game-cover relative min-w-fit overflow-hidden",
          primary && "max-h-[288px]",
        )}
      >
        <Image
          src={props.image ? props.image : "https://fakeimg.pl/80"}
          alt={props.name}
          fill
          objectFit="cover"
          className="rounded-lg border-2 border-neutral-100 dark:border-neutral-900"
        />
      </div>

      <div className="flex h-full min-w-0 flex-col justify-between">
        <div>
          <div
            className={cn(
              "text-neutral-600 dark:text-neutral-700",
              primary && "text-lg",
            )}
          >
            <FontAwesomeIcon
              icon={faStar}
              className="mr-1 text-yellow-500 dark:text-yellow-400"
            />
            <span className="font-bold">{props.rating}</span>
            <span className={cn("text-sm", primary && "text-base")}>/100</span>
          </div>
          <div
            className={cn(
              "my-4 truncate font-bold dark:text-neutral-100",
              primary && "whitespace-break-spaces text-3xl",
            )}
          >
            {props.name}
          </div>
        </div>

        <div className={cn("text-sm text-neutral-700", primary && "text-base")}>
          {props.releaseYear ?? "N/A"}
          <div className="truncate">{props.developer ?? "N/A"}</div>
        </div>
      </div>
    </Link>
  );
};
