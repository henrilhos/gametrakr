import { useEffect, useState } from "react";
import Image from "next/image";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";

type Props = {
  currentImage?: string;
  handleFileChange: (file: FileWithPath) => void;
};

export default function ProfilePictureUploader({
  currentImage,
  handleFileChange,
}: Props) {
  const [image, setImage] = useState(currentImage ?? "/images/not-found.png");

  useEffect(() => {
    if (currentImage) {
      setImage(currentImage);
    }
  }, [currentImage]);

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0]!;

    handleFileChange(file);
    setImage(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/png", "image/jpeg"]),
  });

  return (
    <div className="relative aspect-square h-auto w-1/4 rounded-4xl bg-white p-1 dark:bg-neutral-950">
      <Image
        alt="Profile picture"
        src={image}
        width={100}
        height={100}
        className="h-full w-full rounded-[28px] object-cover"
      />

      <div className="absolute left-0 top-0 h-full w-full p-2">
        <div className="flex h-full w-full items-center justify-center rounded-[28px] bg-white/20 dark:bg-black/20">
          <div
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-black"
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
