"use server";

import {
  and,
  fields,
  igdb,
  limit,
  offset,
  search,
  twitchAccessToken,
  whereIn,
  WhereInFlags,
  type proto,
} from "ts-igdb-client";
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
