import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import toast from "~/components/ui/toast";
import { useUploadThing } from "~/lib/uploadthing";

type Props = {
  currentImage?: string;
};

export default function CoverPictureUploader({ currentImage }: Props) {
  const [image, setImage] = useState<string | undefined>(currentImage);

  useEffect(() => {
    setImage(currentImage);
  }, [currentImage]);

  const { startUpload } = useUploadThing("coverImageUploader", {
    onClientUploadComplete: (data) => {
      if (!data?.[0]) return;
      setImage(data[0].url);
    },
    onUploadError: (err) => {
      toast.error(err.message);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      void startUpload(acceptedFiles);
      setImage(URL.createObjectURL(acceptedFiles[0]!));
    },
    [startUpload],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/png", "image/jpeg"]),
  });

  return (
    <div className="aspect-cover relative w-full rounded-lg bg-yellow-500">
      {image && (
        <Image
          alt="Cover picture"
          src={image}
          width={500}
          height={125}
          className="h-full w-full rounded-lg object-cover"
        />
      )}

      <div className="absolute left-0 top-0 h-full w-full">
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-black/20">
          <div
            className="flex aspect-square h-10 w-10 cursor-pointer items-center justify-center rounded-full dark:bg-black"
            {...getRootProps()}
          >
            <FontAwesomeIcon className="dark:text-white" icon={faCamera} />
            <input {...getInputProps()} />
          </div>
        </div>
      </div>
    </div>
  );
}
