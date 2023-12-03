"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { type inferProcedureOutput } from "@trpc/server";
import { type User } from "next-auth";
import Review from "~/app/games/_components/cards/review";
import Metadata from "~/app/games/_components/metadata";
import Sidebar from "~/app/games/_components/sidebar";
import Tags from "~/app/games/_components/tags";
import Heading from "~/components/heading";
import { cn } from "~/lib/utils";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

export type Game = inferProcedureOutput<AppRouter["game"]["findFirstBySlug"]>;

type Props = {
  user?: User;
};

export default function GameContainer({ user }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const [game] = api.game.findFirstBySlug.useSuspenseQuery({ slug });

  if (!game) return notFound();

  const backgroundImage = game.images?.[0];
  const coverImage = game.cover ? game.cover : "/images/not-found.png";

  return (
    <>
      <div
        className={cn(
          "hidden h-56 w-full rounded-4xl bg-cover bg-center md:block",
          !backgroundImage && "bg-yellow-500 dark:bg-yellow-400",
        )}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      <div className="grid grid-cols-12 gap-6 px-3 pb-3 md:px-8 md:pb-8">
        <div className="relative col-span-12 flex w-full min-w-fit justify-center md:col-span-3 md:-mt-56 md:block">
          <Image
            src={coverImage}
            alt={game.name ?? "Name not found"}
            sizes="100vw"
            width={400}
            height={300}
            className="h-auto w-1/2 rounded-2xl md:w-full"
          />
        </div>

        <div className="col-span-12 flex w-full flex-col items-center gap-8 md:col-span-6 md:items-start">
          <Tags tags={game.genres ?? []} />
          <Heading>{game.name}</Heading>
          <Metadata
            developers={game.developers ?? []}
            releaseDate={game.releaseDate}
          />
          <div className="hidden text-neutral-700 dark:text-neutral-600 md:block">
            {game.summary}
          </div>

          {game.reviews && game.reviews.length > 0 && (
            <div className="hidden h-fit w-full flex-col gap-4 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950 md:flex">
              {game.reviews.map((review, i) => (
                <Review
                  key={i}
                  review={{ ...review }}
                  user={{ ...review.user }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="col-span-12 w-full md:col-span-3">
          <Sidebar user={user} game={game} />
        </div>

        <div className="col-span-12 md:hidden">
          <div className="dark:text-neutral-600">{game.summary}</div>

          {game.reviews && game.reviews.length > 0 && (
            <div className="mt-4 flex h-fit w-full flex-col gap-4 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950">
              {game.reviews.map((review, i) => (
                <Review
                  key={i}
                  review={{ ...review }}
                  user={{ ...review.user }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
