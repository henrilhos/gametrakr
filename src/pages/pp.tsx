import { useDropzone } from "@uploadthing/react/hooks";
import Image from "next/image";
import { useCallback, useState } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { useUploadThing } from "../utils/uploadthing";

import type { FileWithPath } from "@uploadthing/react";
import type { NextPage } from "next";

// TODO: delete after creating profile page
const ProfilePage: NextPage = () => {
  const [img, setImg] = useState("/not-found.png");

  const { startUpload } = useUploadThing("profileImageUploader", {
    onClientUploadComplete: (data) => {
      if (!data?.[0]) return;
      setImg(data[0].url);
    },
    onUploadError: (err) => {
      console.log(err.message);
      setImg("/not-found.png");
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
};
export default ProfilePage;
