"use client";

import { notFound, useSearchParams } from "next/navigation";
import BackButton from "~/components/ui/back-button";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import toast from "~/components/ui/toast";
import { api } from "~/trpc/react";

export default function Page() {
  const searchParams = useSearchParams();
  const credential = searchParams.get("email");

  const { mutateAsync: resendEmail } =
    api.user.sendResetPasswordEmail.useMutation();

  if (!credential) {
    notFound();
  }

  const handleResendEmail = async () => {
    try {
      toast.info("Sending email...");
      await resendEmail({ credential });
      toast.success("Email resent successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-[460px] flex-col gap-12">
      <CardHeader className="gap-6">
        <BackButton />
        <CardTitle>Check your inbox</CardTitle>
      </CardHeader>

      <CardContent className="flex grow flex-col items-start gap-10 text-left">
        <div className="text-lg/tight text-neutral-700 dark:text-slate-400">
          We&apos;ve just sent a reset link to{" "}
          <span className="font-bold text-black dark:text-white">
            {credential}
          </span>
          . Please check your inbox.
        </div>

        <button
          type="button"
          className="text-lg/5 text-black hover:underline dark:text-white"
          onClick={() => void handleResendEmail()}
        >
          RESEND EMAIL
        </button>
      </CardContent>
    </div>
  );
}
