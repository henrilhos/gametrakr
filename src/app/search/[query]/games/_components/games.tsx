"use client";

import { useParams } from "next/navigation";
import GameCard from "~/app/search/_components/cards/game";
import Heading from "~/app/search/_components/heading";
import { Icons } from "~/components/icons";
import { InfiniteScroller } from "~/components/infinite-scroller";
import { api } from "~/trpc/react";

type Game = {
  name: string;
  rating: number;
  releaseYear: number | undefined;
  slug: string;
  developers: string[];
  image: string;
};

function Loading() {
  return (
    <div className="mt-4 flex w-full justify-center">
      <Icons.loading
        aria-label="Loading"
        className="h-5 w-5 animate-spin fill-yellow-200 text-yellow-500 dark:fill-yellow-800 dark:text-yellow-400"
      />
    </div>
  );
}

export default function Games() {
  const { query } = useParams<{ query: string }>();

  const [data, allGamesQuery] = api.game.getByQuery.useSuspenseInfiniteQuery(
    {
      query,
      limit: 40,
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.games.length >= 39) {
          return lastPage.nextCursor;
        }
        return undefined;
      },
      initialCursor: 0,
    },
  );

  const { hasNextPage, fetchNextPage } = allGamesQuery;

  const aggregateGames = () => {
    const pages = data.pages ?? [];
    const { games } = pages.reduce(
      (prev, current) => {
        const combinedGames = prev.games.concat(current.games);
        const shallowCopy = { ...prev };

        shallowCopy.games = combinedGames;

        return shallowCopy;
      },
      { games: [] as Game[] },
    );

    return games;
  };

  return (
    <div className="flex flex-col gap-2">
      <Heading>Games</Heading>

      <InfiniteScroller
        fetchNextPage={() => void fetchNextPage()}
        hasNextPage={Boolean(hasNextPage)}
        loadingMessage={<Loading />}
        endingMessage=""
      >
        {aggregateGames().map((game) => (
          <GameCard key={game.slug} game={{ ...game }} />
        ))}
      </InfiniteScroller>
    </div>
  );
}
