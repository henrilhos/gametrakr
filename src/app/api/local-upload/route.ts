import { NextResponse } from "next/server";
import { env } from "~/env.mjs";
import { saveLocalUpload, type UploadKind } from "~/server/local-upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!env.LOCAL_DEV) return new NextResponse(null, { status: 404 });

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind");

  if (!(file instanceof File) || !isUploadKind(kind)) {
    return NextResponse.json(
      { error: "Invalid upload request" },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json({ url: await saveLocalUpload(file, kind) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to upload image";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

const isUploadKind = (value: FormDataEntryValue | null): value is UploadKind =>
  value === "profileImageUploader" || value === "coverImageUploader";
