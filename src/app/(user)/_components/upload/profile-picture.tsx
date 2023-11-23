import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import toast from "~/components/ui/toast";
import { useUploadThing } from "~/lib/uploadthing";

type Props = { currentImage?: string };

export default function ProfilePictureUploader({ currentImage }: Props) {
  const [image, setImage] = useState(currentImage ?? "/images/not-found.png");

  useEffect(() => {
    if (currentImage) {
      setImage(currentImage);
    }
  }, [currentImage]);

  const { startUpload } = useUploadThing("profileImageUploader", {
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
    <div className="relative aspect-square h-auto w-1/4 rounded-[40px] p-2 dark:bg-neutral-950">
      <Image
        alt="Profile picture"
        src={image}
        width={100}
        height={100}
        className="h-full w-full rounded-4xl object-cover"
      />

      <div className="absolute left-0 top-0 h-full w-full p-2">
        <div className="flex h-full w-full items-center justify-center rounded-4xl bg-black/20">
          <div
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black"
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
