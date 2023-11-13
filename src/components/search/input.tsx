"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "~/lib/utils";

// Search for games, genres, lists, reviews or users
const PLACEHOLDER = "Search for games or users";

type Props = {
  placeholder?: string;
};

export default function SearchInput({ placeholder = PLACEHOLDER }: Props) {
  const [value, setValue] = useState("");
  const router = useRouter();

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function onSubmit(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    if (value) void router.push(`/search/${value}`);
  }

  return (
    <form className="relative h-full w-full" onSubmit={onSubmit}>
      <div className="invisible h-0 w-full pl-5 pr-[68px] text-lg">
        {placeholder}
      </div>

      <input
        className={cn(
          "peer pointer-events-auto h-full max-h-[48px] w-full rounded-xl px-5 pr-[68px] text-lg shadow-none outline outline-0 transition-all md:rounded-2xl",
          "bg-yellow-50 placeholder-yellow-600 hover:placeholder-yellow-700 focus:placeholder-yellow-700",
          "dark:bg-yellow-950 dark:text-yellow-50 dark:placeholder-yellow-500 dark:hover:placeholder-yellow-400 dark:focus:placeholder-yellow-700",
        )}
        placeholder={placeholder}
        onChange={onChange}
      />
      <button
        className={cn(
          "pointer-events-auto absolute inset-y-0 right-0 flex items-center py-3 pl-8 pr-5",
          "text-yellow-600 peer-hover:text-yellow-700 peer-focus:text-yellow-700",
          "dark:text-yellow-500 dark:peer-hover:text-yellow-400 dark:peer-focus:text-yellow-50",
        )}
      >
        <span className="sr-only">Search</span>
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </form>
  );
}
