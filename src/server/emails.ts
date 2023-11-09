import { Resend } from "resend";
import { randomUUID } from "crypto";

import { env } from "~/env.mjs";

import type { ReactElement } from "react";

const resend = new Resend(env.RESEND_API_KEY);

export interface Email {
  react: ReactElement;
  subject: string;
  to: string[];
  from?: string;
}

export const sendEmail = (email: Email) => {
  return resend.emails.send({
    headers: { "X-Entity-Ref-ID": randomUUID() },
    from: `gametrakr <${env.RESEND_EMAIL}>`,
    ...email,
  });
};
