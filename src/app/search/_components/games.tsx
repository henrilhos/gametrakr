"use client";

import { useParams } from "next/navigation";
import BestResultCard from "~/app/search/_components/cards/best-result";
import GameCard from "~/app/search/_components/cards/game";
import Heading from "~/app/search/_components/heading";
import { api } from "~/trpc/react";

export default function Games() {
  const { query } = useParams<{ query: string }>();

  const [response] = api.game.findManyByQuery.useSuspenseQuery({
    query,
    limit: 7,
  });

  if (!response.games || response.games.length <= 0) return null;

  const [bestResult, ...games] = response.games;

  if (!bestResult || !games) return null;

  bestResult.image = bestResult.image.replace("small", "big");

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="col-span-1 flex flex-col gap-2">
        <Heading>Best result</Heading>
        <BestResultCard {...bestResult} />
      </div>

      {games.length > 0 && (
        <div className="col-span-1 flex flex-col gap-2 md:col-span-2">
          <Heading href={`/search/${query}/games`}>Games</Heading>
          <div className="grid grow gap-4 md:grid-cols-3">
            {games.map((game) => (
              <GameCard key={game.slug} {...game} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
