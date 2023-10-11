import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import { TokenType } from "@prisma/client";

import { DialogLayout } from "~/components/layout";
import { LoadingSpinner } from "~/components/ui/loading";
import { api } from "~/utils/api";

import type { NextPage } from "next";

const VerifyAccountPage: NextPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutateAsync: validateAccountMutationAsync } =
    api.auth.validateAccount.useMutation();

  const token = searchParams.get("token");

  const verifyEmail = useCallback(async () => {
    if (token) {
      try {
        await validateAccountMutationAsync({
          id: token,
          type: TokenType.EMAIL,
        });
        void router.push("/auth/sign-in");
      } catch (err) {
        console.log(err);
        void router.push("/auth/sign-in");
      }
    }
  }, [token, router, validateAccountMutationAsync]);

  useEffect(() => {
    void verifyEmail();
  }, [verifyEmail]);

  return (
    <DialogLayout
      className={{
        card: "flex flex-col justify-center md:min-h-[589px]",
      }}
    >
      <LoadingSpinner size={48} />
    </DialogLayout>
  );
};

export default VerifyAccountPage;
