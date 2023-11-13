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
      console.log("Middleware");

      const user = await getCurrentUser();

      if (!user) throw new Error("Unauthorized");

      return {
        userId: user.id,
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
