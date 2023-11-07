import { useState } from "react";
import { useRouter } from "next/router";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { cn } from "~/utils/cn";

import type { ChangeEvent, FormEvent } from "react";

export const SearchInput = ({
  placeholder = "Search for games, genres, lists, reviews or users",
}: {
  placeholder?: string;
}) => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleOnSubmit = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (search) {
      void router.push(`/search?q=${search}`);
    }
  };

  return (
    <form
      className={cn("relative inline-block h-full w-full")}
      onSubmit={handleOnSubmit}
    >
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
        onChange={handleOnChange}
      />
      <button
        className={cn(
          "pointer-events-auto absolute inset-y-0 right-0 flex items-center py-3 pl-8 pr-5",
          "text-yellow-600 peer-hover:text-yellow-700 peer-focus:text-yellow-700",
          "dark:text-yellow-500 dark:peer-hover:text-yellow-400 dark:peer-focus:text-yellow-50",
        )}
        type="submit"
      >
        <FontAwesomeIcon icon={faSearch} />
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
};
