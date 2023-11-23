"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type TRPCError } from "@trpc/server";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import toast from "~/components/ui/toast";
import { useZodForm } from "~/hooks/use-zod-form";
import { getKeys } from "~/lib/utils";
import { SignUpSchema } from "~/server/api/schemas/auth";
import { api } from "~/trpc/react";

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useZodForm({
    schema: SignUpSchema,
    defaultValues: {
      confirmPassword: "",
      email: "",
      password: "",
      username: "",
    },
  });

  const { mutateAsync: createUser } = api.auth.signUp.useMutation();

  const onSubmit = form.handleSubmit(
    async (data) => {
      setIsLoading(true);

      try {
        await createUser({ ...data });
        router.push(`/sign-up/verify?email=${data.email}`);
      } catch (err) {
        const { message } = err as TRPCError;
        toast.error(message);
        setIsLoading(false);
      }
    },
    (data) => {
      const keys = getKeys(data);

      for (const key of keys) {
        const err = data[key];
        if (err && err.message) {
          toast.error(err.message);
          return;
        }
      }
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
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

        <div className="flex flex-col gap-2">
          <div className="text-sm/4 text-neutral-700 dark:text-slate-400">
            By creating you confirm that you&apos;re at least 13 years old and
            agree with our{" "}
            <Link
              href="/legal/terms"
              target="_blank"
              className="font-bold text-black hover:underline dark:text-white"
            >
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy"
              target="_blank"
              className="font-bold text-black hover:underline dark:text-white"
            >
              Privacy Policy
            </Link>
            .
          </div>

          <Button
            type="submit"
            className="min-w-full"
            justify="center"
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner aria-label="Loading" className="animate-spin" />
            )}
            {!isLoading && "Sign Up"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
