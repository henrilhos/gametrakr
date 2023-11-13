import { cookies } from "next/headers";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import { env } from "~/env.mjs";
import { type AppRouter } from "~/server/api/root";
import { getUrl, transformer } from "./shared";

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer,
      links: [
        loggerLink({
          enabled: (opts) =>
            env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          headers() {
            return {
              cookie: cookies().toString(),
              "x-trpc-source": "rsc",
            };
          },
        }),
      ],
    };
  },
});
