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
        "pointer-events-none h-full rounded-t-2xl p-2",
        isFocused && "bg-white",
      )}
    >
      <form className={cn("relative h-full")} onSubmit={handleOnSubmit}>
        <input
          className={cn(
            "peer pointer-events-auto h-full max-h-[48px] min-w-[510px] rounded-2xl bg-yellow-50  px-4 pr-12 text-lg placeholder-yellow-600 shadow-none outline outline-0 transition-all",
            "hover:placeholder-yellow-700 focus:placeholder-yellow-700",
          )}
          placeholder="Search for games, genres, lists, reviews or users."
          onChange={handleOnChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          className="pointer-events-auto absolute inset-y-0 right-0 px-5 py-3 text-yellow-600 peer-hover:text-yellow-700 peer-focus:text-yellow-700"
          type="submit"
        >
          <FontAwesomeIcon icon={faSearch} />
          <span className="sr-only">Search</span>
        </button>
      </form>
      <div
        className={cn(
          "absolute z-10 -mx-2 hidden min-w-[526px] rounded-b-2xl px-6 pb-5 pt-6 text-neutral-700 ",
          isFocused && "block bg-white",
        )}
      >
        Search{" "}
        {search && (
          <>
            <span className="text-black">&quot;{search}&quot;</span>{" "}
          </>
        )}
        {/* TODO: add specific search */}
        {/* in:
        <div>
          <button onClick={() => console.log("OIIIIIII")}>Games</button> |
          Genres | Lists // Reviews // Users
        </div> */}
      </div>
    </div>
  );
};
