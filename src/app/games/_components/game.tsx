"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
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

  if (!game) return null;

  const backgroundImage = game.images?.[0];
  const coverImage = game.cover;

  return (
    <>
      <div
        className="h-56 w-full rounded-4xl bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      <div className="grid gap-6 px-8 md:grid-cols-12">
        <div className="relative col-span-3 -mt-56 w-full min-w-fit 2xl:col-span-2">
          <Image
            src={coverImage ?? "/images/not-found.png"}
            alt={game.name ?? "Name not found"}
            sizes="100vw"
            width={400}
            height={300}
            className="h-auto w-full rounded-2xl"
          />
        </div>

        <div className="col-span-6 flex w-full flex-col gap-8 2xl:col-span-8">
          <Tags tags={game.genres ?? []} />
          <Heading>{game.name}</Heading>
          <Metadata
            developers={game.developers ?? []}
            releaseDate={game.releaseDate}
          />
          <div className="dark:text-neutral-600">{game.summary}</div>
        </div>

        <div className="col-span-3 w-full 2xl:col-span-2">
          <GameCard user={user} criticRating={game.criticScore} />
        </div>
      </div>
    </>
  );
}
