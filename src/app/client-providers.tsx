"use client";

import { useState, type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { ThemeProvider } from "~/components/theme-provider";
import { api } from "~/trpc/react";
import { getUrl, transformer } from "~/trpc/shared";

export default function ClientProviders(
  props: PropsWithChildren<{
    cookies: string;
  }>,
) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          headers() {
            return {
              cookie: props.cookies,
              "x-trpc-source": "react",
            };
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration transformer={transformer}>
        <api.Provider client={trpcClient} queryClient={queryClient}>
          <ThemeProvider>{props.children}</ThemeProvider>
        </api.Provider>
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
