import { cookies } from "next/headers";
import { httpBatchStreamLink, loggerLink } from "@trpc/client";
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import { env } from "~/env.mjs";
import { type AppRouter } from "~/server/api/root";
import { getUrl, transformer } from "./shared";

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchStreamLink({
          url: getUrl(),
          transformer,
          async headers() {
            return {
              cookie: (await cookies()).toString(),
              "x-trpc-source": "rsc",
            };
          },
        }),
      ],
    };
  },
});
