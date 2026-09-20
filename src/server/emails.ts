"use server";

import { randomUUID } from "crypto";
import { createConnection } from "node:net";
import { type ReactElement } from "react";
import { render } from "@react-email/render";
import { env } from "~/env.mjs";

export interface Email {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Resend's email templates accept any element props.
  react: ReactElement<any>;
  subject: string;
  to: string[];
  from?: string;
}

export const sendEmail = async (email: Email) => {
  if (env.LOCAL_DEV) {
    await sendWithMailpit(email);
    return { data: { id: randomUUID() }, error: null };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(env.RESEND_API_KEY);

  return resend.emails.send({
    headers: { "X-Entity-Ref-ID": randomUUID() },
    from: `gametrakr <${env.RESEND_EMAIL}>`,
    ...email,
  });
};

const sendWithMailpit = async (email: Email) => {
  const localSender = env.RESEND_EMAIL?.includes("YOUR_RESEND_EMAIL_HERE")
    ? undefined
    : env.RESEND_EMAIL;
  const from =
    email.from ?? `gametrakr <${localSender ?? "local@gametrakr.test"}>`;
  const html = await render(email.react);
  const message = [
    `From: ${from}`,
    `To: ${email.to.join(", ")}`,
    `Subject: ${email.subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    html,
  ].join("\r\n");

  await smtpConversation({
    from: extractAddress(from),
    message,
    recipients: email.to,
  });
};

const extractAddress = (value: string) => /<([^>]+)>/.exec(value)?.[1] ?? value;

const smtpConversation = ({
  from,
  message,
  recipients,
}: {
  from: string;
  message: string;
  recipients: string[];
}) =>
  new Promise<void>((resolve, reject) => {
    const socket = createConnection({ host: "localhost", port: 1025 });
    const commands = [
      "EHLO localhost",
      `MAIL FROM:<${from}>`,
      ...recipients.map((recipient) => `RCPT TO:<${recipient}>`),
      "DATA",
      `${message.replace(/(^|\r\n)\./g, "$1..")}\r\n.`,
      "QUIT",
    ];
    let commandIndex = 0;
    let response = "";

    socket.once("error", reject);
    socket.on("data", (chunk: Buffer) => {
      response += chunk.toString();
      const lines = response.split("\r\n");
      const lastLine = lines.at(-2);

      if (!lastLine || !/^\d{3} /.test(lastLine)) return;
      if (!lastLine.startsWith("2") && !lastLine.startsWith("3")) {
        socket.end();
        reject(new Error(`Mailpit rejected the message: ${lastLine}`));
        return;
      }

      const command = commands[commandIndex++];
      if (!command) {
        socket.end();
        resolve();
        return;
      }

      response = "";
      socket.write(`${command}\r\n`);
    });
  });
