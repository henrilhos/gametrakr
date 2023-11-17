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

export default function BestResultCard({ ...props }: Props) {
  return (
    <Link
      href={`/games/${props.slug}`}
      className="flex grow gap-4 rounded-2xl border-2 border-yellow-100 bg-yellow-100 p-5 dark:border-yellow-900 dark:bg-yellow-900"
    >
      <div className="flex items-center">
        <Image
          src={props.image ? props.image : "/images/not-found.png"}
          alt={props.name}
          className="h-auto w-full rounded-lg border-2 border-yellow-200 object-cover dark:border-yellow-950"
          width={201}
          height={268}
        />
      </div>

      <div className="flex h-full min-w-0 grow flex-col justify-between py-2">
        <div className="flex flex-col gap-4">
          <div className="text-lg text-neutral-600 dark:text-neutral-400">
            <FontAwesomeIcon
              icon={faStar}
              className="mr-1 text-yellow-500 dark:text-yellow-400"
            />
            <span className="font-bold">{props.rating}</span>
            <span className="text-base">/100</span>
          </div>

          <div className="font-apfel-grotezk text-3xl font-bold">
            {props.name}
          </div>
        </div>

        <div className="text-neutral-700 dark:text-neutral-300">
          <div className="truncate">{props.releaseYear ?? "N/A"}</div>
          <div className="truncate">
            {props.developers.length > 0 ? props.developers.join(", ") : "N/A"}
          </div>
        </div>
      </div>
    </Link>
  );
}
