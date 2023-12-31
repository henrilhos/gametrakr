import Image from "next/image";
import Link from "next/link";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  name: string;
  rating: number;
  releaseYear?: number;
  slug: string;
  developers: string[];
  image: string;
};

export default function GameCard({ ...props }: Props) {
  return (
    <Link
      href={`/games/${props.slug}`}
      className="flex h-full w-full min-w-full grow gap-4 rounded-2xl border-2 border-neutral-100 bg-white p-3 dark:border-neutral-950 dark:bg-neutral-950"
    >
      <div className="relative aspect-game-cover min-w-fit overflow-hidden">
        <Image
          fill
          src={props.image ? props.image : "/images/not-found.png"}
          alt={props.name}
          className="rounded-lg border-2 border-neutral-100 object-cover dark:border-neutral-900"
        />
      </div>

      <div className="flex h-full min-w-0 flex-col justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-neutral-600 dark:text-neutral-400">
            <FontAwesomeIcon
              icon={faStar}
              className="mr-1 text-yellow-500 dark:text-yellow-400"
            />
            <span className="font-bold">{props.rating}</span>
            <span className="text-sm">/100</span>
          </div>

          <div className="truncate font-apfel-grotezk font-bold">
            {props.name}
          </div>
        </div>

        <div className="text-sm text-neutral-700 dark:text-neutral-300">
          <div className="truncate">{props.releaseYear ?? "N/A"}</div>
          <div className="truncate">
            {props.developers.length > 0 ? props.developers.join(", ") : "N/A"}
          </div>
        </div>
      </div>
    </Link>
  );
}
