import { NextResponse } from "next/server";
import { env } from "~/env.mjs";
import { readLocalUpload } from "~/server/local-upload";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  if (!env.LOCAL_DEV) return new NextResponse(null, { status: 404 });

  const { filename } = await params;
  const image = await readLocalUpload(filename);
  if (!image) return new NextResponse(null, { status: 404 });

  return new NextResponse(image, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": filename.endsWith(".png") ? "image/png" : "image/jpeg",
    },
  });
}
