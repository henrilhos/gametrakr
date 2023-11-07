import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GameCard } from "~/components/game-card";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";

import type { NextPage } from "next";

type HeadingProps = {
  title: string;
  query?: string | null;
};
const Heading = (props: HeadingProps) => {
  return (
    <div className="flex items-center">
      <h2 className="grow font-serif text-2xl font-bold dark:text-neutral-100">
        {props.title}
      </h2>
      {props.query && (
        <Link
          href={`/${props.title.toLowerCase()}?q=${props.query}`}
          className="text-sm font-bold uppercase text-neutral-600 hover:underline dark:text-neutral-700"
        >
          Show More
          <FontAwesomeIcon icon={faCaretRight} className="ml-1" />
        </Link>
      )}
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
      <div className="flex flex-col gap-8 px-4 py-3 md:px-8 md:py-6">
        {data?.games && data.games.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="col-span-1 flex flex-col gap-2">
              <Heading title="Best result" />

              {data.bestResult && <GameCard primary {...data.bestResult} />}
            </div>

            <div className="col-span-1 flex flex-col gap-2 md:col-span-2">
              <Heading title="Games" query={query} />

              <div className="grid gap-4 md:grid-cols-3">
                {data.games.map((game) => (
                  <GameCard key={game.slug} {...game} />
                ))}
              </div>
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
