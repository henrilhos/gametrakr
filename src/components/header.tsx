import { useState } from "react";
import Link from "next/link";

import {
  faEllipsisVertical,
  faMoon,
  faRightToBracket,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

import { Heading } from "~/components/heading";
import { Menu } from "~/components/menu";
import { SearchInput } from "~/components/search-input";
import { Button } from "~/components/ui/button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, systemTheme, setTheme } = useTheme();
  const { data: sessionData } = useSession();

  const toggleTheme = () => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="absolute left-0 top-0 flex w-full justify-between px-3 py-4 md:gap-3 md:px-8 md:py-6">
      <Link href="/">
        <Heading>gametrakr</Heading>
      </Link>

      <div className="inline-flex items-center gap-2 md:hidden">
        {!sessionData && (
          <Button size="icon" onClick={() => void signIn()}>
            <FontAwesomeIcon className="h-10 w-10" icon={faRightToBracket} />
          </Button>
        )}

        <Button size="icon" variant="icon" onClick={() => setIsMenuOpen(true)}>
          <FontAwesomeIcon className="h-10 w-10" icon={faEllipsisVertical} />
        </Button>

        <Menu open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>

      <div className="hidden gap-4 md:flex">
        <SearchInput />

        <Button
          variant="secondary"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
          className="w-40"
        >
          {sessionData ? "Sign out" : "Sign in"}
        </Button>

        {!sessionData && (
          <Button as="a" href="/auth/sign-up" className="w-40">
            Sign up
          </Button>
        )}

        <Button
          variant="icon"
          size="icon"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          <FontAwesomeIcon
            className="h-12 w-12 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            icon={faSun}
          />
          <FontAwesomeIcon
            className="absolute h-12 w-12 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            icon={faMoon}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};
