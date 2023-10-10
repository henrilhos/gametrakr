import * as React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type ConfirmEmailProps = {
  href?: string;
};
const ResetPassword = ({ href = "https://google.com" }: ConfirmEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your gametrakr password</Preview>
      <Tailwind>
        <Body className="mx-auto bg-white font-sans">
          <Container className="mx-auto max-w-[600px]">
            <Heading className="my-[30px] p-0 text-4xl font-bold text-[#1d1c1d]">
              Reset your password
            </Heading>

            <Text className="mb-[30px] text-xl">
              Follow the button to reset the password for your user.
            </Text>

            <Section className="text-center">
              <Button
                className="min-w-[10rem] items-center rounded-2xl bg-[#f2a100] px-5 py-3 text-xl font-bold leading-6 text-[#121212]"
                href={href}
              >
                Reset Password
              </Button>
            </Section>

            <Text className="text-sm leading-6 text-black">
              If you didn&apos;t request this email, there&apos;s nothing to
              worry about - you can safely ignore it.
            </Text>

            <Text className="mb-[50px] text-left text-xs text-[#b7b7b7]">
              ©2023 gametrakr
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPassword;
