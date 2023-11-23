import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { getCurrentUser } from "~/lib/session";
import { db, eq, users } from "~/server/db";

const f = createUploadthing();

export const appFileRouter = {
  // TODO: search how to update session with the uploaded image
  profileImageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await getCurrentUser();
      if (!user) throw Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const user = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, metadata.userId),
        columns: { profileImage: true },
      });

      if (user?.profileImage) {
        const utApi = new UTApi();
        await utApi.deleteFiles(user.profileImage.split("/").pop()!);
      }

      await db
        .update(users)
        .set({
          profileImage: file.url,
        })
        .where(eq(users.id, metadata.userId));
    }),
  coverImageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await getCurrentUser();
      if (!user) throw Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const user = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, metadata.userId),
        columns: { coverImage: true },
      });

      if (user?.coverImage) {
        const utApi = new UTApi();
        await utApi.deleteFiles(user.coverImage.split("/").pop()!);
      }

      await db
        .update(users)
        .set({
          coverImage: file.url,
        })
        .where(eq(users.id, metadata.userId));
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof appFileRouter;
