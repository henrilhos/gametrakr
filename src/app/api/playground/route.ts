import { renderTrpcPanel } from "trpc-panel";
import { getBaseUrl } from "~/lib/utils";
import { appRouter } from "~/server/api/root";

const handler = () => {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Playground available only in development mode", {
      status: 403,
    });
  }

  return new Response(
    renderTrpcPanel(appRouter, {
      url: `${getBaseUrl()}/api/trpc`,
      transformer: "superjson",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    },
  );
};

export { handler as GET, handler as POST };
