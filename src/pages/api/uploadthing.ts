import { createNextPageApiHandler } from "uploadthing/next-legacy";

import { appFileRouter } from "~/server/uploadthing";

const handler = createNextPageApiHandler({
  router: appFileRouter,
});

export default handler;
