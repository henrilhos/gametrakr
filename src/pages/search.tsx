import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GameCard } from "~/components/game-card";
import { PageLayout } from "~/components/layout";
import { ProfileCard } from "~/components/profile-card";
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
              {data.users.map((user) => (
                <ProfileCard key={user.name} {...user} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
export default SearchPage;
