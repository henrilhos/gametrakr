import { useState } from "react";
import { useRouter } from "next/router";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { cn } from "~/utils/cn";

import type { ChangeEvent, FormEvent } from "react";

export const SearchInput = () => {
  const [isFocused, setIsFocused] = useState(false);
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
    <div
      className={cn(
        "pointer-events-none relative h-full rounded-t-2xl p-2",
        isFocused &&
          "border-x-2 border-t-2 border-neutral-100 bg-white dark:border-neutral-950 dark:bg-black",
      )}
      // onBlur={() => setIsFocused(false)}
    >
      <form className={cn("relative h-full")} onSubmit={handleOnSubmit}>
        <input
          className={cn(
            "peer pointer-events-auto h-full max-h-[48px] min-w-[510px] rounded-2xl px-4 pr-12 text-lg shadow-none outline outline-0 transition-all",
            "bg-yellow-50 placeholder-yellow-600 hover:placeholder-yellow-700 focus:placeholder-yellow-700",
            "dark:bg-yellow-950 dark:text-yellow-50 dark:placeholder-yellow-500 dark:hover:placeholder-yellow-400 dark:focus:placeholder-yellow-700",
          )}
          placeholder="Search for games, genres, lists, reviews or users."
          onChange={handleOnChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          className={cn(
            "pointer-events-auto absolute inset-y-0 right-0 px-5 py-3 ",
            "text-yellow-600 peer-hover:text-yellow-700 peer-focus:text-yellow-700",
            "dark:text-yellow-500 dark:peer-hover:text-yellow-400 dark:peer-focus:text-yellow-50",
          )}
          type="submit"
        >
          <FontAwesomeIcon icon={faSearch} />
          <span className="sr-only">Search</span>
        </button>
      </form>
      <div
        className={cn(
          "absolute z-10 -ml-2.5 hidden min-w-[530px] rounded-b-2xl border-x-2 border-b-2 border-neutral-100 bg-white px-6 pb-5 pt-6 text-neutral-700 dark:border-neutral-950 dark:bg-black dark:text-slate-300",
          isFocused && "block",
        )}
      >
        Search{" "}
        {search && (
          <>
            <span className="text-black dark:text-yellow-50">
              &quot;{search}&quot;
            </span>{" "}
          </>
        )}
        {/* TODO: add specific search */}
        {/* in:
        <div>
          <button
            className="pointer-events-auto"
            onClick={() => console.log("OIIIIIII")}
          >
            Games
          </button>
        </div> */}
      </div>
    </div>
  );
};
