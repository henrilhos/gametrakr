import { useCallback, useState } from "react";
import Link from "next/link";

import { signUpSchema } from "~/common/validation/auth";
import { AuthPageLayout, DialogLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/loading";
import toast from "~/components/ui/toast";
import { api } from "~/utils/api";
import { useZodForm } from "~/utils/zod-form";

import type { TRPCError } from "@trpc/server";
import type { SignUp } from "~/common/validation/auth";
import type { NextPage } from "next";
import type { FieldErrors } from "react-hook-form";

const SignUpPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [mailSent, setMailSent] = useState(false);

  const form = useZodForm({ schema: signUpSchema });

  const { mutateAsync: signUpMutationAsync } = api.auth.signUp.useMutation();
  const { mutateAsync: resendEmailMutationAsync } =
    api.auth.resendEmailVerification.useMutation();

  const onValid = useCallback(
    async (data: SignUp) => {
      setLoading(true);

      try {
        await signUpMutationAsync(data);

        localStorage.setItem("email", data.email);
        setMailSent(true);
        setLoading(false);
      } catch (err) {
        const message = (err as TRPCError).message ?? "";

        if (message === "User already exists") {
          form.setError("username", { message });
          form.setError("email", { message });
        }

        setLoading(false);
        toast.error(message);
      }
    },
    [signUpMutationAsync, form],
  );

  const onInvalid = useCallback((data: FieldErrors<SignUp>) => {
    const fields: (keyof SignUp)[] = [
      "username",
      "email",
      "password",
      "confirmPassword",
    ];

    for (const field of fields) {
      if (data[field]) {
        toast.error(data[field]?.message ?? "");
        return;
      }
    }
  }, []);

  const resendEmail = useCallback(async () => {
    setLoading(true);
    const email = form.getValues("email");

    try {
      await resendEmailMutationAsync({ email });

      setLoading(false);
      toast.success("Email resent successfully");
    } catch (err) {
      console.log(err);
    }
  }, [form, resendEmailMutationAsync]);

  if (loading) {
    return (
      <DialogLayout
        className={{
          card: "flex flex-col justify-center md:min-h-[706px]",
        }}
      >
        <LoadingSpinner size={48} />
      </DialogLayout>
    );
  }

  if (mailSent) {
    return (
      <AuthPageLayout
        title="Verify your account"
        className={{ card: "md:min-h-[706px]" }}
      >
        <div className="text-left text-lg leading-6">
          We&apos;ve just sent a verification link to{" "}
          <span className="font-bold">{form.getValues("email")}</span>. Please
          check your inbox.
        </div>

        <div className="mt-4 text-left">
          <button
            type="button"
            className="text-lg leading-5 hover:underline"
            onClick={() => void resendEmail()}
          >
            RESEND EMAIL
          </button>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout
      title="Join the community"
      className={{ card: "md:min-h-[706px]" }}
    >
      <Form {...form}>
        <form
          onSubmit={(event) =>
            void form.handleSubmit(onValid, onInvalid)(event)
          }
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
                    <Input label="Email" state={fieldState} {...field} />
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
            <Link
              href="/auth/sign-in"
              className="font-bold text-card-foreground hover:underline"
            >
              Sign In
            </Link>
          </div>
        </form>
      </Form>
    </AuthPageLayout>
  );
};
export default SignUpPage;
