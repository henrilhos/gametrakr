"use client";

import { useState, type PropsWithChildren } from "react";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "~/lib/utils";

type TagProps = PropsWithChildren<{ onClick?: () => void }>;

function Tag({ children, onClick }: TagProps) {
  return (
    <button
      className={cn(
        "flex cursor-default select-none items-center rounded-2xl bg-yellow-50 px-3 py-2 text-sm/none capitalize text-yellow-600 dark:bg-yellow-950 dark:text-yellow-500",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

type Props = {
  tags: string[];
};

export default function Tags({ tags }: Props) {
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.slice(0, 5).map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}

      {tags.length > 5 &&
        showMore &&
        tags.slice(5).map((tag) => <Tag key={tag}>{tag}</Tag>)}

      {tags.length > 5 && (
        <Tag onClick={handleShowMore}>
          <FontAwesomeIcon icon={showMore ? faMinus : faPlus} />
        </Tag>
      )}
    </div>
  );
}
