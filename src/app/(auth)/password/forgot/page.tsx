"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type TRPCError } from "@trpc/server";
import { Icons } from "~/components/icons";
import BackButton from "~/components/ui/back-button";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import toast from "~/components/ui/toast";
import { useZodForm } from "~/hooks/use-zod-form";
import { ForgotPasswordSchema } from "~/server/api/schemas/auth";
import { api } from "~/trpc/react";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useZodForm({
    schema: ForgotPasswordSchema,
    defaultValues: { credential: "" },
  });

  const { mutateAsync: sendResetPasswordEmail } =
    api.user.sendResetPasswordEmail.useMutation();

  const onSubmit = form.handleSubmit(
    async (data) => {
      setIsLoading(true);

      try {
        const res = await sendResetPasswordEmail({ ...data });
        if (res.email) {
          router.push(`/password/verify?email=${res.email}`);
        }
        setIsLoading(false);
      } catch (err) {
        const { message } = err as TRPCError;
        toast.error(message);
        setIsLoading(false);
      }
    },
    (data) => {
      if (data.credential?.message) {
        toast.error(data.credential.message);
      }
    },
  );

  return (
    <div className="flex min-h-[460px] flex-col gap-12">
      <CardHeader className="gap-6">
        <BackButton />
        <CardTitle>Find your account</CardTitle>
      </CardHeader>

      <CardContent className="grow">
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <div className="text-left text-lg/6 text-neutral-700 dark:text-slate-400">
                Enter the{" "}
                <span className="font-bold text-black dark:text-white">
                  email
                </span>{" "}
                or{" "}
                <span className="font-bold text-black dark:text-white">
                  nickname
                </span>{" "}
                associated with your account to change your password.
              </div>

              <FormField
                control={form.control}
                name="credential"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        label="Email or username"
                        state={fieldState}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button justify="center" type="submit" disabled={isLoading} full>
              {isLoading && (
                <Icons.spinner aria-label="Loading" className="animate-spin" />
              )}
              {!isLoading && "Send reset link"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
