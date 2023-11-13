"use client";

import { useEffect, useState } from "react";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";
import { cn } from "~/lib/utils";

export default function ThemeSwitch() {
  const [isChecked, setIsChecked] = useState(false);
  const { theme, systemTheme, setTheme } = useTheme();

  function handleChangeTheme() {
    const current = theme === "system" ? systemTheme : theme;

    setTheme(current === "dark" ? "light" : "dark");
  }

  useEffect(() => {
    const current = theme === "system" ? systemTheme : theme;
    setIsChecked(current === "dark");
  }, [systemTheme, theme]);

  return (
    <Switch
      checked={isChecked}
      onChange={handleChangeTheme}
      className="relative inline-flex h-10 w-[72px] flex-shrink-0 cursor-pointer rounded-xl bg-neutral-100 p-1 transition-colors duration-200 ease-in-out dark:bg-neutral-900"
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={cn(
          isChecked && "translate-x-8 bg-yellow-400 text-black",
          !isChecked && "translate-x-0 bg-yellow-500 text-white",
          "pointer-events-none relative inline-block h-8 w-8 transform rounded-xl ring-0 transition duration-200 ease-in-out",
        )}
      >
        <span
          className={cn(
            isChecked && "opacity-0 duration-100 ease-out",
            !isChecked && "opacity-100 duration-200 ease-in",
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
          )}
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={faSun} />
        </span>
        <span
          className={cn(
            isChecked && "opacity-100 duration-200 ease-in",
            !isChecked && "opacity-0 duration-100 ease-out",
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
          )}
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={faMoon} />
        </span>
      </span>
    </Switch>
  );
}
