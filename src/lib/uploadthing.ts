"use client";

import { useCallback, useState } from "react";
import { generateReactHelpers } from "@uploadthing/react";
import { type AppFileRouter } from "~/server/uploadthing";

const { uploadFiles, useUploadThing: useUploadThingRemote } =
  generateReactHelpers<AppFileRouter>();

type UploadEndpoint = "profileImageUploader" | "coverImageUploader";
type UploadOptions = {
  onUploadError?: (error: Error) => void;
};

export { uploadFiles };

const useLocalUploadThing = (
  endpoint: UploadEndpoint,
  options?: UploadOptions,
) => {
  const [isUploading, setIsUploading] = useState(false);
  const startUpload = useCallback(
    async (files: File[]) => {
      setIsUploading(true);
      try {
        return await Promise.all(
          files.map(async (file) => {
            const formData = new FormData();
            formData.set("file", file);
            formData.set("kind", endpoint);

            const response = await fetch("/api/local-upload", {
              body: formData,
              method: "POST",
            });
            const body = (await response.json()) as {
              error?: string;
              url?: string;
            };
            if (!response.ok || !body.url) {
              throw new Error(body.error ?? "Unable to upload image");
            }

            return { url: body.url };
          }),
        );
      } catch (error) {
        const uploadError =
          error instanceof Error ? error : new Error("Unable to upload image");
        options?.onUploadError?.(uploadError);
        throw uploadError;
      } finally {
        setIsUploading(false);
      }
    },
    [endpoint, options],
  );

  return { isUploading, routeConfig: undefined, startUpload };
};

export const useUploadThing =
  process.env.NEXT_PUBLIC_LOCAL_DEV === "true"
    ? useLocalUploadThing
    : useUploadThingRemote;
