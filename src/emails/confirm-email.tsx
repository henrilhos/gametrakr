import * as React from "react";

import {
  Body,
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
  validationCode?: string;
};
const ConfirmEmail = ({ validationCode = "123456" }: ConfirmEmailProps) => {
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
              Your confirmation code is below - enter it in your open browser
              window and we&apos;ll verify your account.
            </Text>

            <Section className="mb-[30px] mr-[50px] rounded bg-[#F5F4F5] px-[23px] py-[43px]">
              <Text className="text-center align-middle text-3xl">
                {validationCode}
              </Text>
            </Section>

            <Text className="text-sm leading-6 text-black">
              If you didn&apos;t request this email, there&apos;s nothing to
              worry about - you can safely ignore it.
            </Text>

            <Section>
              <Text className="mb-[50px] text-left text-xs text-[#b7b7b7]">
                ©2023 gametrakr
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ConfirmEmail;
