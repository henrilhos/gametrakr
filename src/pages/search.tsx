import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { faCaretRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";

import type { NextPage } from "next";

type GameCardProps = {
  image: string;
  name: string;
  rating: number;
  releaseYear: number;
  slug: string;
  developer?: string;
};
const GameCard = (props: GameCardProps) => {
  return (
    <Link
      href={`/game/${props.slug}`}
      className="flex gap-4 rounded-3xl border-2 border-neutral-100 bg-white p-4 dark:border-0 dark:bg-neutral-950"
    >
      <Image
        src={props.image}
        width={128}
        height={184}
        alt={props.name}
        className="rounded-lg border-2 border-neutral-100 dark:border-neutral-900"
      />
      <div className="flex min-w-0 flex-col gap-4">
        <div className="text-neutral-600 dark:text-neutral-700">
          <FontAwesomeIcon icon={faStar} className="mr-1 text-yellow-500" />
          <span className="font-bold">{props.rating}</span>
          <span className="text-sm">/100</span>
        </div>
        <div className="font-bold dark:text-neutral-100">{props.name}</div>
        <div className="text-sm text-neutral-700">
          <div>{props.releaseYear}</div>
          <div className="truncate">{props.developer}</div>
        </div>
      </div>
    </Link>
  );
};

type HeadingProps = {
  title: string;
  query?: string | null;
};
const Heading = (props: HeadingProps) => {
  return (
    <div className="flex">
      <h2 className="grow font-serif text-2xl font-bold dark:text-neutral-100">
        {props.title}
      </h2>
      <Link
        href={`/${props.title.toLowerCase()}?q=${props.query}`}
        className="text-sm font-bold uppercase text-neutral-600 hover:underline dark:text-neutral-700"
      >
        Show More
        <FontAwesomeIcon icon={faCaretRight} className="ml-1" />
      </Link>
    </div>
  );
};

const SearchPage: NextPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q");

  const { data, isLoading } = api.search.getAllByQuery.useQuery({
    query: query ?? "",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-8 px-8 py-6">
        {data?.games && data.games.length > 0 && (
          <div>
            <Heading title="Games" query={query} />

            <div className="mt-2 grid grid-cols-4 gap-4">
              {data.games.map((game) => (
                <GameCard key={game.slug} {...game} />
              ))}
            </div>
          </div>
        )}

        {data?.users && data.users.length > 0 && (
          <div>
            <Heading title="Users" query={query} />

            <div className="mt-2 grid grid-cols-4 gap-4">
              {data.users.map((u) => (
                <Link
                  key={u.name}
                  href={`/${u.name}`}
                  className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-neutral-100 bg-white p-2 dark:border-0 dark:bg-neutral-950"
                >
                  <div className="relative flex h-full w-full flex-col items-center pb-[40px]">
                    {/* <div className="h-20 w-full rounded-lg bg-[url('https://fakeimg.pl/80')]"> */}
                    <div className="h-20 w-full rounded-lg bg-yellow-500">
                      <div className="h-full w-full rounded-lg bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <Image
                      className="absolute bottom-0 rounded-3xl border-4 border-green-300 dark:border-green-500"
                      src="https://fakeimg.pl/80"
                      width={80}
                      height={80}
                      alt={`@${u.name}'s profile picture`}
                    />
                  </div>
                  <div className="text-font-bold text-lg font-bold text-green-600 dark:text-green-500">
                    {u.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SearchPage;
