"use server";

import {
  and,
  fields,
  igdb,
  limit,
  offset,
  search,
  twitchAccessToken,
  where,
  whereIn,
  WhereInFlags,
} from "ts-igdb-client";
import type { proto } from "ts-igdb-client";
import { env } from "~/env.mjs";
import { unixTimestampToYear } from "~/lib/utils";

const TWITCH_SECRETS = {
  client_id: env.TWITCH_CLIENT_ID,
  client_secret: env.TWITCH_SECRET_ID,
};

const getClient = async () => {
  const accessToken = await twitchAccessToken(TWITCH_SECRETS);
  return igdb(TWITCH_SECRETS.client_id, accessToken);
};

const gameMapper = (game: proto.IGame) => {
  const developers =
    game.involved_companies
      ?.filter((c) => c.developer)
      .map((c) => c.company?.name ?? "")
      .filter((d) => !!d) ?? [];

  return {
    name: game.name ?? "",
    rating: Math.round(game.aggregated_rating ?? 0),
    releaseYear: unixTimestampToYear(game.first_release_date),
    slug: game.slug ?? "",
    developers,
    image: (game.cover?.url ?? "")
      .replace("thumb", "cover_small_2x")
      .replace("//", "https://"),
  };
};

export interface GameSearch {
  query: string;
  limit?: number;
  cursor?: number;
}

export const getGames = async ({
  query,
  limit: l = 10,
  cursor = 0,
}: GameSearch) => {
  const client = await getClient();

  const { data } = await client
    .request("games")
    .pipe(
      search(query),
      fields([
        "name",
        "slug",
        "cover.url",
        "aggregated_rating",
        "first_release_date",
        "involved_companies.company.name",
        "involved_companies.developer",
        "involved_companies.publisher",
      ]),
      and(whereIn("category", [0, 8, 9, 10, 11], WhereInFlags.OR)),
      limit(l),
      offset(cursor),
    )
    .execute();

  return data.map(gameMapper);
};

export const getGameBySlug = async ({ slug }: { slug: string }) => {
  const client = await getClient();

  const { data: response } = await client
    .request("games")
    .pipe(
      fields([
        "name",
        "summary",
        "first_release_date",
        "genres.name",
        "platforms.name",
        "involved_companies.company.name",
        "involved_companies.developer",
        "themes.name",
        "cover.url",
        "screenshots.url",
        "aggregated_rating",
      ]),
      where("slug", "=", slug),
    )
    .execute();

  const [data] = response.map((game) => {
    const themes =
      game.themes?.map((t) => t.name ?? "").filter((t) => !!t) ?? [];

    const genres =
      game.genres?.map((g) => g.name ?? "").filter((g) => !!g) ?? [];

    const platforms =
      game.platforms
        ?.map((p) => ({ name: p.name ?? "" }))
        .filter((p) => !!p.name) ?? [];

    const developers =
      game.involved_companies
        ?.filter((c) => c.developer)
        .map((c) => c.company?.name ?? "")
        .filter((d) => !!d) ?? [];

    const images =
      game.screenshots?.map(
        (s) => s.url?.replace("thumb", "1080p").replace("//", "https://") ?? "",
      ) ?? [];

    const cover = (game.cover?.url ?? "")
      .replace("thumb", "cover_big_2x")
      .replace("//", "https://");

    const criticRating = !!game.aggregated_rating
      ? Math.round(game.aggregated_rating)
      : undefined;

    return {
      name: game.name,
      summary: game.summary,
      releaseDate: new Date((game.first_release_date ?? 0) * 1000),
      genres: [...genres, ...themes],
      criticRating,
      platforms,
      developers,
      images,
      cover,
    };
  });

  return data;
};
