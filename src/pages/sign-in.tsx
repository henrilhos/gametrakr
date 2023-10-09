import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { signInSchema } from "~/common/validation/auth";
import { AuthPageLayout, DialogLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/loading";
import toast from "~/components/ui/toast";

import type { SignIn } from "~/common/validation/auth";
import type { NextPage } from "next";

const SignInPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error("Invalid credentials");
    }
  }, [error]);

  const form = useForm<SignIn>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
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
          card: "flex flex-col justify-center md:min-h-[589px]",
        }}
      >
        <LoadingSpinner size={48} />
      </DialogLayout>
    );
  }

  return (
    <AuthPageLayout title="Join the community">
      <Form {...form}>
        <form
          onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
          className="space-y-8"
        >
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="username"
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
                    <Input label="Password" type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* TODO: add Forgot your password link */}
          </div>

          <Button
            type="submit"
            className="min-w-full"
            align="center"
            disabled={loading}
          >
            Sign in
          </Button>

          <div>
            <div className="text-lg leading-6 text-muted-foreground">
              New on gametrakr?
            </div>
            <Button
              align="center"
              className="mt-2 min-w-full"
              type="button"
              variant="secondary"
              onClick={() => void router.push("/sign-up")}
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
