import { useRouter } from "next/router";

import { useWindowSize } from "@uidotdev/usehooks";
import { useSession } from "next-auth/react";

import { Heading } from "~/components/heading";
import { PageLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { useMediaQuery } from "~/hooks/use-media-query";

import type { NextPage } from "next";

const HomePage: NextPage = () => {
  const isSmallDevice = useMediaQuery("only screen and (max-width: 768px)");
  let height = 0;

  if (typeof window !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    height = useWindowSize().height ?? 0;
  }

  const router = useRouter();
  const { data: sessionData } = useSession();

  const getTitleAndYear = () => {
    return `Starfield (2023)`.toUpperCase();
  };

  return (
    <PageLayout>
      <Container>
        <Card
          className="flex h-fit max-w-full flex-col justify-between rounded-2xl bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(https://i.imgur.com/bNNed9d.png)",
            minHeight: `calc(${height}px - ${
              isSmallDevice ? "4.25" : "11.25"
            }rem)`,
          }}
        >
          {/* TODO: add link to game page */}
          <div className="ml-4 mt-4 text-background">{getTitleAndYear()}</div>

          <div className="flex flex-col items-center">
            <Card className="mx-8 my-12 max-w-screen-md p-8 md:mx-0 md:px-20 md:py-12">
              <Heading size="lg">Track your gaming journey</Heading>

              <div className="mt-8 text-center text-lg text-muted md:text-xl">
                Show what games you love, share your thoughts and experiences
                and connect with a thriving gaming community.
              </div>

              {!sessionData && (
                <div className="mt-10 text-center md:mt-16">
                  <Button
                    size="lg"
                    align="center"
                    onClick={() => void router.push("/sign-up")}
                  >
                    Get started
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </Card>
      </Container>
    </PageLayout>
  );
};
export default HomePage;
