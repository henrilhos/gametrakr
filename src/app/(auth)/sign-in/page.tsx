import Link from "next/link";
import SignInForm from "~/components/forms/sign-in";
import BackButton from "~/components/ui/back-button";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function Page() {
  return (
    <div className="flex flex-col gap-12">
      <CardHeader className="gap-6">
        <BackButton />
        <CardTitle>Welcome back</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <SignInForm />

        <div className="flex flex-col gap-2 text-lg/6 text-neutral-700 dark:text-neutral-400">
          New on gametrakr?
          <Button variant="secondary" justify="center" full>
            <Link href="/sign-up" passHref>
              Create an account
            </Link>
          </Button>
        </div>
      </CardContent>
    </div>
  );
}
