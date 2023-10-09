import { renderTrpcPanel } from "trpc-panel";

import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { getBaseSsrUrl } from "~/utils/api";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  if (env.NODE_ENV !== "development") {
    res
      .status(403)
      .send({ message: "Playground available only in development mode" });
  }

  res.status(200).send(
    renderTrpcPanel(appRouter, {
      url: `${getBaseSsrUrl()}/api/trpc`,
      transformer: "superjson",
    }),
  );
};
export default handler;
