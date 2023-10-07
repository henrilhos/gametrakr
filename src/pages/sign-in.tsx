import { useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { signInSchema } from "~/common/validation/auth";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { AuthPageLayout } from "../components/layout";

import type { SignIn } from "~/common/validation/auth";
import type { NextPage } from "next";

const SignInPage: NextPage = () => {
  const form = useForm<SignIn>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = useCallback(async (data: SignIn) => {
    await signIn("credentials", { ...data, callbackUrl: "/" });
  }, []);

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

          <Button type="submit" className="min-w-full" align="center">
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
