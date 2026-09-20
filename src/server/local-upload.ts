import { randomUUID } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { getCurrentUser } from "~/lib/session";
import { db, eq, users } from "~/server/db";

const uploadDirectory = path.join(process.cwd(), ".local", "uploads");
const uploadPathPrefix = "/api/local-upload/";
const maxFileSize = 4 * 1024 * 1024;

const fileExtensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
} as const;

export type UploadKind = "profileImageUploader" | "coverImageUploader";

export const saveLocalUpload = async (file: File, kind: UploadKind) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  if (file.size > maxFileSize) throw new Error("Images must be 4MB or smaller");

  const extension = fileExtensions[file.type as keyof typeof fileExtensions];
  if (!extension) throw new Error("Only PNG and JPEG images are supported");

  const column =
    kind === "profileImageUploader" ? "profileImage" : "coverImage";
  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
    columns: { profileImage: true, coverImage: true },
  });
  const filename = `${randomUUID()}.${extension}`;
  const imageUrl = `${uploadPathPrefix}${filename}`;

  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(
    path.join(uploadDirectory, filename),
    Buffer.from(await file.arrayBuffer()),
  );
  await db
    .update(users)
    .set({ [column]: imageUrl })
    .where(eq(users.id, user.id));
  await deletePreviousLocalUpload(currentUser?.[column]);

  return imageUrl;
};

export const readLocalUpload = async (filename: string) => {
  if (!/^[a-f0-9-]+\.(jpg|png)$/.test(filename)) return undefined;

  try {
    return await readFile(path.join(uploadDirectory, filename));
  } catch {
    return undefined;
  }
};

const deletePreviousLocalUpload = async (imageUrl?: string | null) => {
  if (!imageUrl?.startsWith(uploadPathPrefix)) return;

  const filename = imageUrl.slice(uploadPathPrefix.length);
  if (!/^[a-f0-9-]+\.(jpg|png)$/.test(filename)) return;

  await unlink(path.join(uploadDirectory, filename)).catch(() => undefined);
};
