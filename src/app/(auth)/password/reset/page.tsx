"use client";

import { useState } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { type TRPCError } from "@trpc/server";
import { Icons } from "~/components/icons";
import BackButton from "~/components/ui/back-button";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import toast from "~/components/ui/toast";
import { useZodForm } from "~/hooks/use-zod-form";
import { getKeys } from "~/lib/utils";
import { ResetPasswordSchema } from "~/server/api/schemas/auth";
import { api } from "~/trpc/react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { mutateAsync: resetPassword } = api.user.resetPassword.useMutation();

  if (!token || !email) {
    notFound();
  }

  const form = useZodForm({
    schema: ResetPasswordSchema,
    defaultValues: { token, email, confirmPassword: "", password: "" },
  });

  const onSubmit = form.handleSubmit(
    async (data) => {
      setIsLoading(true);

      try {
        await resetPassword({ ...data });
        toast.success("Password reset successfully");
        router.push("/sign-in");
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
    <div className="flex min-h-[460px] flex-col gap-12">
      <CardHeader className="gap-6">
        <BackButton />
        <CardTitle>Reset your password</CardTitle>
      </CardHeader>

      <CardContent className="grow">
        <Form {...form}>
          <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
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

            <Button full justify="center" type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner aria-label="Loading" className="animate-spin" />
              )}
              {!isLoading && "Reset password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
