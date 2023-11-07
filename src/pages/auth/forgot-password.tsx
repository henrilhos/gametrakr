import { useCallback, useState } from "react";

import { forgotPasswordSchema } from "~/common/validation/auth";
import { AuthPageLayout, DialogLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/loading";
import toast from "~/components/ui/toast";
import { api } from "~/utils/api";
import { useZodForm } from "~/utils/zod-form";

import type { TRPCError } from "@trpc/server";
import type { ForgotPassword } from "~/common/validation/auth";
import type { NextPage } from "next";
import type { FieldErrors } from "react-hook-form";

const ForgotPasswordPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [mailSent, setMailSent] = useState(false);

  const { mutateAsync } = api.auth.forgotPassword.useMutation();

  const form = useZodForm({ schema: forgotPasswordSchema });

  const onValid = useCallback(
    async (data: ForgotPassword) => {
      setLoading(true);
      try {
        await mutateAsync(data);

        setMailSent(true);
        setLoading(false);
      } catch (err) {
        const message = (err as TRPCError).message ?? "";

        if (message === "User not found") {
          form.setError("credential", { message: "User not found" });
        }

        setLoading(false);
        toast.error(message);
      }
    },
    [form, mutateAsync],
  );

  const onInvalid = useCallback((data: FieldErrors<ForgotPassword>) => {
    if (data.credential) {
      toast.error(data.credential.message ?? "");
    }
  }, []);

  if (loading) {
    return (
      <DialogLayout
        className={{ card: "flex flex-col justify-center md:min-h-[622px]" }}
      >
        <LoadingSpinner size={48} />
      </DialogLayout>
    );
  }

  if (mailSent) {
    return (
      <AuthPageLayout
        title="Check your inbox"
        className={{ card: "md:min-h-[622px]" }}
      >
        <div className="flex flex-col items-start gap-10 text-left">
          <div className="text-lg/tight text-neutral-700 dark:text-slate-400">
            We&apos;ve just sent a reset link to{" "}
            <span className="text-black dark:text-white">
              {form.getValues("credential")}
            </span>
            . Please check your inbox.
          </div>

          <button
            type="button"
            className="text-lg/5 hover:underline"
            onClick={() => void mutateAsync(form.getValues())}
          >
            RESEND EMAIL
          </button>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout
      title="Find your account"
      className={{ card: "md:min-h-[622px]" }}
    >
      <Form {...form}>
        <form
          onSubmit={(event) =>
            void form.handleSubmit(onValid, onInvalid)(event)
          }
          className="flex flex-col gap-8"
        >
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
                      label="Email or Nickname"
                      state={fieldState}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button justify="center" type="submit" full>
            Send reset link
          </Button>
        </form>
      </Form>
    </AuthPageLayout>
  );
};
export default ForgotPasswordPage;
