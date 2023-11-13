"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import toast from "~/components/ui/toast";
import { useZodForm } from "~/hooks/use-zod-form";
import { SignInSchema } from "~/server/api/schemas/auth";

export default function SignInForm() {
  const form = useZodForm({
    schema: SignInSchema,
    defaultValues: { credential: "", password: "" },
  });
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error("Invalid credentials");
    }
  }, [error]);

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    await signIn("credentials", { ...data, callbackUrl });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="credential"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input label="Email or username" {...field} />
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
                        href="/password/forgot"
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

        <Button justify="center" full type="submit" disabled={isLoading}>
          {isLoading && (
            <Icons.spinner aria-label="Loading" className="animate-spin" />
          )}
          {!isLoading && "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
