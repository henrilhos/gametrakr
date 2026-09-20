"use server";

import { randomUUID } from "crypto";
import { type ReactElement } from "react";
import { env } from "~/env.mjs";

export interface Email {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Resend's email templates accept any element props.
  react: ReactElement<any>;
  subject: string;
  to: string[];
  from?: string;
}

export const sendEmail = async (email: Email) => {
  const { Resend } = await import("resend");
  const resend = new Resend(env.RESEND_API_KEY);

  return resend.emails.send({
    headers: { "X-Entity-Ref-ID": randomUUID() },
    from: `gametrakr <${env.RESEND_EMAIL}>`,
    ...email,
  });
};
