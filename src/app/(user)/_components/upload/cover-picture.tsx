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

export default function CoverPictureUploader({
  currentImage,
  handleFileChange,
}: Props) {
  const [image, setImage] = useState<string | undefined>(currentImage);

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
    <div className="relative aspect-cover w-full rounded-lg bg-yellow-500">
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
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/20 dark:bg-black/20">
          <div
            className="flex aspect-square h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-black"
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
