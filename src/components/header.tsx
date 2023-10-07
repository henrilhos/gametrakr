import Link from "next/link";
import { useRouter } from "next/router";

import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <header className="mx-8 my-4 flex justify-between md:mx-16 md:my-8">
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
                <Heading align="left" size="sm">
                  gametrakr
                </Heading>
              </SheetTitle>
            </SheetHeader>
            <div className="full-height-sheet flex flex-col-reverse gap-4">
              <SheetClose>
                <Button
                  className="min-w-full"
                  onClick={() => void router.push("/sign-up")}
                >
                  Sign Up
                </Button>
              </SheetClose>
              <SheetClose>
                <Button
                  className="min-w-full"
                  onClick={() => void router.push("/sign-in")}
                  variant="secondary"
                >
                  Sign In
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden gap-4 md:flex">
        {/* TODO: change to <Button /> */}
        <Button
          variant="secondary"
          onClick={() => void router.push("/sign-in")}
        >
          Sign In
        </Button>
        <Button onClick={() => void router.push("/sign-up")}>Sign Up</Button>

        {/* TODO: add toggle theme button */}
        <Button
          className="ml-4"
          variant="icon"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <FontAwesomeIcon
            className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            icon={faSun}
          />
          <FontAwesomeIcon
            className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            icon={faMoon}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};
