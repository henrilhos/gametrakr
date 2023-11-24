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
          <Link href="/sign-up" passHref>
            <Button variant="secondary" justify="center" full>
              Create an account
            </Button>
          </Link>
        </div>
      </CardContent>
    </div>
  );
}
