import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import { resetPasswordSchema } from "~/common/validation/auth";
import { AuthPageLayout, DialogLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/loading";
import toast from "~/components/ui/toast";
import { api } from "~/utils/api";
import { useZodForm } from "~/utils/zod-form";

import type { ResetPassword } from "~/common/validation/auth";
import type { NextPage } from "next";
import type { FieldErrors } from "react-hook-form";

const ResetPasswordAccount: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useZodForm({ schema: resetPasswordSchema });

  const { mutateAsync } = api.auth.resetPassword.useMutation();

  useEffect(() => {
    form.setValue("email", searchParams?.get("email") ?? "");
    form.setValue("token", searchParams?.get("token") ?? "");
  }, [form, searchParams]);

  // TODO: verify if token is valid and if matches with email

  const onValid = useCallback(
    async (data: ResetPassword) => {
      setLoading(true);

      try {
        await mutateAsync(data);
        void router.push("/auth/sign-in");
      } catch (error) {
        console.log(error);
      }
      console.log(data);
    },
    [router, mutateAsync],
  );

  const onInvalid = useCallback((data: FieldErrors<ResetPassword>) => {
    const fields: (keyof ResetPassword)[] = ["password", "confirmPassword"];

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
        className={{ card: "flex flex-col justify-center md:min-h-[605.5px]" }}
      >
        <LoadingSpinner size={48} />
      </DialogLayout>
    );
  }

  return (
    <AuthPageLayout title="Choose your new password">
      <Form {...form}>
        <form
          className="flex flex-col gap-8"
          onSubmit={(event) =>
            void form.handleSubmit(onValid, onInvalid)(event)
          }
        >
          <div className="flex flex-col gap-6">
            <div className="text-left text-lg/tight text-neutral-700 dark:text-neutral-300">
              Make sure your new password is 8 characters or longer, and
              includes numbers, letters, and punctuation marks.
            </div>

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

          <Button justify="center" type="submit" full>
            Reset Password
          </Button>
        </form>
      </Form>
    </AuthPageLayout>
  );
};
export default ResetPasswordAccount;
