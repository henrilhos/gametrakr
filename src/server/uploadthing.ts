import { type NextApiRequest, type NextApiResponse } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { getServerAuthSession } from "~/server/auth";
import { db, eq, users } from "~/server/db";

const f = createUploadthing();

export const appFileRouter = {
  profileImageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req, res }) => {
      const session = await getServerAuthSession(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse,
      );

      if (!session?.user) throw new Error("Unauthorized");

      return {
        userId: session.user.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const profile = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, metadata.userId),
        columns: { profileImage: true },
      });

      if (profile?.profileImage) {
        const utapi = new UTApi();
        await utapi.deleteFiles(profile.profileImage.split("/").pop()!);
      }

      await db
        .update(users)
        .set({
          profileImage: file.url,
        })
        .where(eq(users.id, metadata.userId));
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof appFileRouter;
