import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signUpSchema } from "~/common/validation/auth";
import { AuthPageLayout, DialogLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/loading";
import toast from "~/components/ui/toast";
import { api } from "~/utils/api";

import type { TRPCError } from "@trpc/server";
import type { SignUp } from "~/common/validation/auth";
import type { NextPage } from "next";
import type { FieldErrors } from "react-hook-form";

const SignUpPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
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

  const onValid = useCallback(
    async (data: SignUp) => {
      setLoading(true);

      try {
        const result = await mutateAsync(data);
        if (result.status === 201) {
          localStorage.setItem("email", data.email);
          void router.push("/verify");
        } else {
          setLoading(false);
          toast.error(result.message);
        }
      } catch (e) {
        const message = (e as TRPCError).message ?? "";

        if (message === "User already exists") {
          form.setError("username", { message });
          form.setError("email", { message });
        }

        setLoading(false);
        toast.error(message);
      }
    },
    [mutateAsync, router, form],
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

  return (
    <AuthPageLayout title="Join the community">
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
