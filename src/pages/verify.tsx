import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import { DialogLayout } from "~/components/layout";
import { LoadingSpinner } from "~/components/ui/loading";
import { api } from "~/utils/api";

import type { NextPage } from "next";

const VerifyAccountPage: NextPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutateAsync: validateAccountMutationAsync } =
    api.auth.validateAccount.useMutation();

  const id = searchParams.get("token");
  const type = searchParams.get("type") as "EMAIL" | "PASSWORD";
  const redirectTo = searchParams.get("redirect_to");

  const verifyEmail = useCallback(() => {
    if (id && type) {
      validateAccountMutationAsync({ id, type })
        .then((response) => {
          if (response.status === 200) {
            void router.push(redirectTo ?? "/sign-in");
          }
        })
        .catch(() => {
          void router.push("/sign-in");
        });
    }
  }, [id, router, type, redirectTo, validateAccountMutationAsync]);

  useEffect(() => {
    verifyEmail();
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
