import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { signIn } from "next-auth/react";

import { signInSchema } from "~/common/validation/auth";
import { AuthPageLayout, DialogLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/loading";
import toast from "~/components/ui/toast";
import { useZodForm } from "~/utils/zod-form";

import type { SignIn } from "~/common/validation/auth";
import type { NextPage } from "next";

const SignInPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const callbackUrl = searchParams?.get("callbackUrl") ?? "/";
  const error = searchParams?.get("error");

  useEffect(() => {
    if (error) {
      toast.error("Invalid credentials");
    }
  }, [error]);

  const form = useZodForm({ schema: signInSchema });

  const onValid = useCallback(
    async (data: SignIn) => {
      setLoading(true);
      await signIn("credentials", { ...data, callbackUrl });
    },
    [callbackUrl],
  );

  if (loading) {
    return (
      <DialogLayout
        className={{
          card: "flex flex-col justify-center md:min-h-[622px]",
        }}
      >
        <LoadingSpinner size={48} />
      </DialogLayout>
    );
  }

  return (
    <AuthPageLayout title="Welcome back">
      <Form {...form}>
        <form
          onSubmit={(event) => void form.handleSubmit(onValid)(event)}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="credential"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input label="Email or Nickname" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input label="Password" type="password" {...field} />
                      <div className="text-right">
                        <Link
                          className="font-bold text-black hover:underline dark:text-white"
                          href="/auth/forgot-password"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button justify="center" full type="submit">
            Sign in
          </Button>

          <div className="flex flex-col gap-2 text-lg/6 text-neutral-700 dark:text-slate-400">
            New on gametrakr?
            <Button
              as="a"
              variant="secondary"
              full
              justify="center"
              href="/auth/sign-up"
            >
              Create an Account
            </Button>
          </div>
        </form>
      </Form>
    </AuthPageLayout>
  );
};
export default SignInPage;
