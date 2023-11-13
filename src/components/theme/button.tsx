"use client";

import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";

export default function ThemeButton() {
  const { theme, systemTheme, setTheme } = useTheme();

  function handleChangeTheme() {
    const current = theme === "system" ? systemTheme : theme;

    setTheme(current === "dark" ? "light" : "dark");
  }

  return (
    <Button
      variant="icon"
      size="icon"
      aria-label="Toggle theme"
      justify="center"
      onClick={handleChangeTheme}
    >
      <div className="flex h-12 w-12 items-center justify-center">
        <FontAwesomeIcon
          className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          icon={faSun}
        />
        <FontAwesomeIcon
          className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          icon={faMoon}
        />
        <span className="sr-only">Toggle theme</span>
      </div>
    </Button>
  );
}
