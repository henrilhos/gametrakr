"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { type FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "~/lib/uploadthing";

type Props = {
  image?: string | null;
};

export default function Upload({ image }: Props) {
  const [img, setImg] = useState(image ?? "/images/not-found.png");

  const { startUpload } = useUploadThing("profileImageUploader", {
    onClientUploadComplete: (data) => {
      console.log("onClientUploadComplete");
      if (!data?.[0]) return;
      setImg(data[0].url);
    },
    onUploadError: (err) => {
      console.log("onUploadError");
      console.log(err.message);
      setImg("/images/not-found.png");
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      void startUpload(acceptedFiles);
      setImg(URL.createObjectURL(acceptedFiles[0]!));
    },
    [startUpload],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/png", "image/jpeg"]),
  });

  return (
    <div>
      <div {...getRootProps()}>
        {img && (
          <Image
            key={img}
            src={img}
            alt="Profile image"
            width={150}
            height={150}
          />
        )}

        <p>Upload</p>
        <input {...getInputProps()} />
      </div>
    </div>
  );
}
