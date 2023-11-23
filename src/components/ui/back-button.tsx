"use client";

import { useRouter } from "next/navigation";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "~/lib/utils";

type Props = {
  className?: string;
  onClick?: () => void;
};

export default function BackButton({ className, onClick }: Props) {
  const router = useRouter();

  const handleOnClick = () => {
    if (onClick) {
      onClick();
    } else {
      void router.back();
    }
  };

  return (
    <button
      className={cn(
        "inline-flex gap-1.5 text-lg/5 font-bold uppercase text-neutral-900 dark:text-neutral-100",
        className,
      )}
      onClick={handleOnClick}
    >
      <FontAwesomeIcon icon={faCaretLeft} className="h-5" />
      BACK
    </button>
  );
}
