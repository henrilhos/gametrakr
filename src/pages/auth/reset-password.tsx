import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { resetPasswordSchema } from "~/common/validation/auth";
import { AuthPageLayout, DialogLayout } from "~/components/layout";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/loading";
import { Button } from "../../components/ui/button";
import toast from "../../components/ui/toast";
import { api } from "../../utils/api";

import type { ResetPassword } from "~/common/validation/auth";
import type { NextPage } from "next";
import type { FieldErrors } from "react-hook-form";

const ResetPasswordAccount: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<ResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams?.get("token") ?? "",
      token: searchParams?.get("token") ?? "",
      password: "",
      confirmPassword: "",
    },
  });

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
        className={{ card: "flex flex-col justify-center md:min-h-[621px]" }}
      >
        <LoadingSpinner size={48} />
      </DialogLayout>
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
        >
          <div className="space-y-8">
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

          <Button className="mt-8 min-w-full" align="center">
            Reset Password
          </Button>
        </form>
      </Form>
    </AuthPageLayout>
  );
};
export default ResetPasswordAccount;
