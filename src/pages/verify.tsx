import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import VerificationInput from "react-verification-input";

import { AuthPageLayout } from "~/components/layout";
import { api } from "~/utils/api";

import type { NextPage } from "next";

const VerifyAccountPage: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { mutateAsync } = api.auth.validateAccount.useMutation();

  useEffect(() => {
    setEmail(localStorage.getItem("email") ?? "");
  }, []);

  const maskEmail = (email: string) => {
    const atIndex = email.indexOf("@");
    if (atIndex === -1) {
      return email;
    }

    const username = email.slice(0, atIndex);
    const [domain, tld] = email.slice(atIndex).split(".");

    const maskedUsername =
      username.slice(0, 3) + "*".repeat(username.length - 3);
    const maskedDomain =
      (domain ?? "").slice(0, 3) + "*".repeat((domain ?? "").length - 4);

    return `${maskedUsername}${maskedDomain}.${tld}`;
  };

  const handleOnComplete = async (value: string) => {
    if (value.length !== 6 || !email) {
      return;
    }

    try {
      const result = await mutateAsync({ token: value, email });
      if (result.status === 200) {
        void router.push("/sign-in");
      } else {
        setMessage("Incorrect code");
      }
    } catch (_) {
      setMessage("Incorrect code");
    }
  };

  return (
    <AuthPageLayout
      title="Verification code"
      className={{ card: "md:min-h-[706px]" }}
    >
      <div className="text-left text-lg leading-6">
        We&apos;ve sent you a verification code to the email{" "}
        <span className="font-bold">{maskEmail(email)}</span>. Please check your
        inbox and enter the code below.
      </div>

      <div className="mt-12">
        <div
          className={clsx(
            "text-left text-destructive",
            !message && "text-transparent",
          )}
        >
          <FontAwesomeIcon icon={faCircleExclamation} className="mr-1.5" />
          {message}
        </div>
        <VerificationInput
          onComplete={(value) => void handleOnComplete(value)}
          autoFocus
          validChars="0-9"
          length={6}
          placeholder=""
          classNames={{
            container: "mt-2 h-20 min-w-[384px]",
            character:
              "flex items-center justify-center rounded-2xl border-none bg-[#FFE5B2] text-center text-[56px] leading-[69px]",
            characterInactive: "",
            characterSelected:
              "text-black outline-none inner-border-4 inner-border-foreground",
          }}
        />
        <div className="mt-2 text-right">
          <button
            type="button"
            className="inline-flex text-lg leading-5 hover:underline"
            onClick={() => void router.back()}
          >
            <div>RESEND EMAIL</div>
          </button>
        </div>
      </div>
    </AuthPageLayout>
  );
};

export default VerifyAccountPage;
