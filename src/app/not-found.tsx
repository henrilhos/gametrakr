import Link from "next/link";
import Heading from "~/components/heading";
import WarningIcon from "~/components/icons/warning";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex h-full min-h-screen w-full max-w-3xl flex-col items-center justify-center py-20">
      <div className="m-8 flex gap-8">
        <div className="mt-4 hidden md:block">
          <WarningIcon />
        </div>

        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-2">
            <Heading size="xl">404</Heading>
            <div className="font-apfel-grotezk text-3xl/tight">
              You hit an invisible wall...
            </div>
          </div>

          <div className="flex flex-col gap-8 ">
            <div className="text-xl/tight text-neutral-800 dark:text-neutral-400">
              Sorry, the page you were looking for doesn’t exist or has been
              removed.
              <br />
              Click the button below to go back to the homepage.
            </div>

            <Button variant="secondary" className="mt-8 md:max-w-fit">
              <Link href="/" passHref>
                Go to homepage
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
