import Link from "next/link";
import MobileSignInButton from "~/components/auth/mobile-sign-in-button";
import SignInButton from "~/components/auth/sign-in-button";
import SignOutButton from "~/components/auth/sign-out-button";
import SignUpButton from "~/components/auth/sign-up-button";
import Heading from "~/components/heading";
import Menu from "~/components/menu";
import SearchInput from "~/components/search/input";
import ThemeButton from "~/components/theme/button";
import { Button } from "~/components/ui/button";
import { getCurrentUser } from "~/lib/session";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="flex w-full justify-between px-3 py-4 md:gap-3 md:px-8 md:py-6">
      <Link href="/" passHref>
        <Heading>gametrakr</Heading>
      </Link>

      <div className="flex items-center gap-2 md:hidden">
        {!user && <MobileSignInButton />}

        <Menu user={user} />
      </div>

      <div className="hidden gap-4 md:flex">
        <SearchInput />

        {!user && (
          <>
            <SignInButton className="w-40" />
            <SignUpButton className="w-40" />
          </>
        )}
        {user && (
          <>
            <Link href={`/${user.username}`} passHref>
              <Button variant="secondary">My profile</Button>
            </Link>
            <SignOutButton />
          </>
        )}

        <ThemeButton />
      </div>
    </header>
  );
}
