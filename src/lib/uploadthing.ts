import { generateReactHelpers } from "@uploadthing/react";
import { type AppFileRouter } from "~/server/uploadthing";

export const { uploadFiles, useUploadThing } =
  generateReactHelpers<AppFileRouter>();
