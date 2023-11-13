"use client";

import { useCallback, useEffect } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Icons } from "~/components/icons";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { mutateAsync: confirmAccount } = api.user.confirmAccount.useMutation();

  if (!token || !email) {
    notFound();
  }

  const handleConfirmAccount = useCallback(async () => {
    if (!email || !token) return;

    try {
      await confirmAccount({ email, tokenId: token });
      void router.push("/sign-in");
    } catch (err) {
      console.error(err);
      void router.push("/sign-in");
    }
  }, [confirmAccount, email, router, token]);

  useEffect(() => {
    void handleConfirmAccount();
  }, [handleConfirmAccount]);

  return (
    <div className="flex min-h-[460px] flex-col gap-12">
      <CardHeader className="gap-6">
        <CardTitle className="mt-11">Verifying your account...</CardTitle>
      </CardHeader>

      <CardContent className="flex grow flex-col justify-center gap-10">
        <div className="flex justify-center">
          <Icons.loading
            aria-label="Loading"
            className="h-10 w-10 animate-spin fill-yellow-200 text-yellow-500 dark:fill-yellow-800 dark:text-yellow-400"
            fill=""
          />
        </div>
      </CardContent>
    </div>
  );
}
