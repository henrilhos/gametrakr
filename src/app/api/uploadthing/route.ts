import { createRouteHandler } from "uploadthing/next";
import { appFileRouter } from "~/server/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: appFileRouter,
});
