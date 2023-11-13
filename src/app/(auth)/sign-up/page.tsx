import Link from "next/link";
import SignUpForm from "~/components/forms/sign-up";
import BackButton from "~/components/ui/back-button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function Page() {
  return (
    <div className="flex flex-col gap-12">
      <CardHeader className="gap-6">
        <BackButton />
        <CardTitle>Join the community</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <SignUpForm />

        <div className="text-lg/6 text-neutral-700 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-bold text-black hover:underline dark:text-white"
          >
            Sign In
          </Link>
        </div>
      </CardContent>
    </div>
  );
}
