"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { type User } from "next-auth";
import GameCard from "~/app/games/_components/game-card";
import Metadata from "~/app/games/_components/metadata";
import Tags from "~/app/games/_components/tags";
import Heading from "~/components/heading";
import { api } from "~/trpc/react";

type Props = {
  user?: User;
};

export default function GameContainer({ user }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const [game] = api.game.getBySlug.useSuspenseQuery({ slug });

  if (!game) return notFound();

  const backgroundImage = game.images?.[0];
  const coverImage = game.cover;

  return (
    <>
      <div
        className="hidden h-56 w-full rounded-4xl bg-cover bg-center md:block"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      <div className="grid grid-cols-12 gap-6 px-3 md:px-8">
        <div className="relative col-span-12 flex w-full min-w-fit justify-center md:col-span-3 md:-mt-56 md:block 2xl:col-span-2">
          <Image
            src={coverImage ?? "/images/not-found.png"}
            alt={game.name ?? "Name not found"}
            sizes="100vw"
            width={400}
            height={300}
            className="h-auto w-1/2 rounded-2xl md:w-full"
          />
        </div>

        <div className="col-span-12 flex w-full flex-col items-center gap-8 md:col-span-6 md:items-start 2xl:col-span-8">
          <Tags tags={game.genres ?? []} />
          <Heading>{game.name}</Heading>
          <Metadata
            developers={game.developers ?? []}
            releaseDate={game.releaseDate}
          />
          <div className="hidden dark:text-neutral-600 md:block">
            {game.summary}
          </div>
        </div>

        <div className="col-span-12 w-full md:col-span-3 2xl:col-span-2">
          <GameCard user={user} criticRating={game.criticScore} />
        </div>

        <div className="col-span-12 md:hidden">
          <div className="dark:text-neutral-600">{game.summary}</div>
        </div>
      </div>
    </>
  );
}
