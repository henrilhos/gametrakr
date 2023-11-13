"use client";

import React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

interface TagButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

const TagButton = React.forwardRef<HTMLButtonElement, TagButtonProps>(
  ({ isActive, ...props }, ref) => {
    return (
      <button
        className={cn(
          "rounded-[40px] bg-yellow-50 px-4 py-2 text-sm/none uppercase text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-600 dark:hover:bg-yellow-900",
          isActive &&
            "bg-yellow-300 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-400 dark:text-yellow-900 dark:hover:bg-yellow-300",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

TagButton.displayName = "TagButton";

const getActivePath = (pathname: string) => {
  const [currentPath] = pathname.split("/").slice(-1);

  if (currentPath === "games") {
    return "games";
  }

  if (currentPath === "users") {
    return "users";
  }

  return "all";
};

export default function Explorer() {
  const { query } = useParams<{ query: string }>();
  const pathname = usePathname();
  const router = useRouter();

  const activePath = getActivePath(pathname);

  return (
    <div className="flex gap-2">
      <TagButton
        isActive={activePath === "all"}
        onClick={() => router.push(`/search/${query}`)}
      >
        All
      </TagButton>
      <TagButton
        isActive={activePath === "games"}
        onClick={() => router.push(`/search/${query}/games`)}
      >
        Games
      </TagButton>
      <TagButton
        isActive={activePath === "users"}
        onClick={() => router.push(`/search/${query}/users`)}
      >
        Users
      </TagButton>
    </div>
  );
}

// /search/god%20of%20war
// /search/god%20of%20war/games
// /search/god%20of%20war/users
