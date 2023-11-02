import { type NextPage } from "next";
import { useSearchParams } from "next/navigation";

import { GameCard } from "~/components/game-card";
import { InfiniteScroller } from "~/components/infinite-scroller";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";

const SearchGamesPage: NextPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") ?? "";

  const { data, fetchNextPage, hasNextPage } =
    api.search.getGames.useInfiniteQuery(
      {
        query,
        limit: 50,
      },
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.games.length >= 50) {
            return lastPage.nextCursor;
          }
          return undefined;
        },
        initialCursor: 0,
      },
    );

  const aggregateGames = () => {
    const pages = data?.pages;
    const games = pages?.reduce((prev, current) => {
      const combinedGames = prev.games.concat(current.games);
      const shallowCopy = { ...prev };

      shallowCopy.games = combinedGames;

      return shallowCopy;
    }).games;

    return games;
  };

  return (
    <PageLayout>
      <div className="mx-8 my-6">
        <InfiniteScroller
          fetchNextPage={() => void fetchNextPage()}
          hasNextPage={hasNextPage ?? false}
          loadingMessage={<p>Loading...</p>}
          endingMessage={""}
        >
          {aggregateGames()?.map((game) => (
            <GameCard key={game.slug} {...game} />
          ))}
        </InfiniteScroller>
      </div>
    </PageLayout>
  );
};
export default SearchGamesPage;
