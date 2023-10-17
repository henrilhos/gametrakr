import Link from "next/link";

import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

import { Heading } from "~/components/heading";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export const Header = () => {
  const { theme, systemTheme, setTheme } = useTheme();
  const { data: sessionData } = useSession();

  const toggleTheme = () => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="mx-8 my-6 flex justify-between md:mx-8 md:my-6">
      <Link href="/">
        <Heading>gametrakr</Heading>
      </Link>

      <div className="inline-flex items-center md:hidden">
        <Sheet>
          <SheetTrigger>
            <FontAwesomeIcon size="2xl" icon={faBars} />
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <Heading size="sm">gametrakr</Heading>
              </SheetTitle>
            </SheetHeader>
            <div className="full-height-sheet flex flex-col-reverse gap-4">
              <SheetClose>
                <Button full as="a" href="/auth/sign-up">
                  Sign Up
                </Button>
              </SheetClose>
              <SheetClose>
                <Button full variant="secondary" onClick={() => void signIn()}>
                  Sign In
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden gap-4 md:flex">
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
