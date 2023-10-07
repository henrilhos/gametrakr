import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signUpSchema } from "~/common/validation/auth";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { AuthPageLayout } from "../components/layout";

import type { SignUp } from "~/common/validation/auth";
import type { NextPage } from "next";

const SignUpPage: NextPage = () => {
  const router = useRouter();
  const form = useForm<SignUp>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync } = api.auth.signUp.useMutation();

  const onSubmit = useCallback(
    async (data: SignUp) => {
      const result = await mutateAsync(data);
      if (result.status === 201) {
        void router.push("/sign-in");
      }
    },
    [mutateAsync, router],
  );

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
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input label="Nickname" state={fieldState} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="Email"
                      type="email"
                      state={fieldState}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="Password"
                      type="password"
                      state={fieldState}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="Confirm password"
                      type="password"
                      state={fieldState}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div>
            <div className="text-sm leading-4 text-muted-foreground">
              By creating you agree to the{" "}
              <span className="font-bold text-card-foreground">
                Terms and Conditions
              </span>
              .
            </div>
            <Button type="submit" className="mt-2 min-w-full" align="center">
              Sign Up
            </Button>
          </div>

          <div className="text-lg leading-6 text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in">
              <span className="font-bold text-card-foreground hover:underline">
                Sign In
              </span>
            </Link>
          </div>
        </form>
      </Form>
    </AuthPageLayout>
  );
};
export default SignUpPage;
