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
        className={{ card: "flex flex-col justify-center md:min-h-[621px]" }}
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
          We&apos;ve just sent a reset link to{" "}
          <span className="font-bold">{form.getValues("credential")}</span>.
          Please check your inbox.
        </div>

        <div className="mt-4 text-left">
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
      title="Reset password"
      className={{ card: "md:min-h-[621px]" }}
    >
      <Form {...form}>
        <form
          onSubmit={(event) =>
            void form.handleSubmit(onValid, onInvalid)(event)
          }
          className="space-y-6"
        >
          <div className="text-left text-lg leading-6 text-muted-foreground">
            Enter your account&apos;s{" "}
            <span className="font-bold">email or nickname</span> below. We will
            send a link to reset your password to your inbox.
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

          <Button justify="center" type="submit" full>
            Send reset link
          </Button>
        </form>
      </Form>
    </AuthPageLayout>
  );
};
export default ForgotPasswordPage;
