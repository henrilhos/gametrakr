import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import { Heading } from "~/components/heading";
import { PageLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Container } from "~/components/ui/container";

import type { NextPage } from "next";

const HomePage: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const image =
    "https://blog.br.playstation.com/tachyon/sites/4/2023/09/1e7bd7539e6c12744bec0368cc51d372761c22e4-scaled.jpeg";

  const getTitleAndYear = () => {
    return `Starfield (2023)`.toUpperCase();
  };

  return (
    <PageLayout>
      <Container className="flex min-h-screen flex-col md:-mt-[96px] md:pt-[96px]">
        <Card
          className="flex max-w-full grow flex-col justify-between rounded-2xl bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${image})`,
          }}
        >
          {/* TODO: add link to game page */}
          <div className="ml-4 mt-4 text-background">{getTitleAndYear()}</div>

          <div className="flex flex-col items-center md:mx-6 md:my-6">
            <Card className="min-w-full px-12 pb-12 pt-10">
              <Heading align="left" size="lg">
                Track your gaming journey
              </Heading>

              <div className="mt-10 flex flex-col items-end justify-between md:flex-row">
                <div className="text-lg text-muted md:text-xl">
                  Show everyone what games you love, share your thoughts and
                  experiences
                  <br /> and connect with a passionate gaming community.
                </div>

                {!sessionData && (
                  <div className="mt-3 min-w-full text-center md:mt-0 md:min-w-fit">
                    <Button
                      size="lg"
                      align="center"
                      onClick={() => void router.push("/auth/sign-up")}
                    >
                      Get started
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </Card>
      </Container>
    </PageLayout>
  );
};
export default HomePage;
