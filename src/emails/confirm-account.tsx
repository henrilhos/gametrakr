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
import * as React from "react";

type ConfirmAccountProps = {
  href?: string;
};
const ConfirmAccount = ({
  href = "https://google.com",
}: ConfirmAccountProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirm your gametrakr account</Preview>
      <Tailwind>
        <Body className="mx-auto bg-white font-sans">
          <Container className="mx-auto max-w-[600px]">
            <Heading className="my-[30px] p-0 text-4xl font-bold text-[#1d1c1d]">
              Confirm your account
            </Heading>

            <Text className="mb-[30px] text-xl">
              Thank you for signing up for gametrakr. To confirm your acount,
              please follow the button below.
            </Text>

            <Section className="text-center">
              <Button
                className="min-w-[10rem] items-center rounded-2xl bg-[#f2a100] px-5 py-3 text-xl/6 font-bold text-[#121212]"
                href={href}
              >
                Confirm Account
              </Button>
            </Section>

            <Text className="text-sm/6 text-black">
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

export default ConfirmAccount;
