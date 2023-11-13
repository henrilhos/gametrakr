"use client";

import { useRouter } from "next/navigation";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      className="inline-flex gap-1.5 text-lg/5 font-bold uppercase text-neutral-900 dark:text-neutral-100"
      onClick={() => void router.back()}
    >
      <FontAwesomeIcon icon={faCaretLeft} className="h-5" />
      BACK
    </button>
  );
}
