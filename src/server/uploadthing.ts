import { getServerSession } from "next-auth";
import { createUploadthing } from "uploadthing/next-legacy";
import { UTApi } from "uploadthing/server";

import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

import type { NextApiRequest, NextApiResponse } from "next";
import type { FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();

const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  return session?.user;
};

export const appFileRouter = {
  profileImageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req, res }) => {
      const user = await auth(req, res);

      if (!user) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const user = await db.user.findFirst({
        where: { id: metadata.userId },
        select: { image: true },
      });

      if (user === null) return;

      const { image } = user;

      if (image) {
        const utapi = new UTApi();
        await utapi.deleteFiles(image.split("/").pop()!);
      }

      await db.user.update({
        where: { id: metadata.userId },
        data: { image: file.url },
      });
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof appFileRouter;
