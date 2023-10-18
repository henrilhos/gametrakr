import { useSession } from "next-auth/react";

import { Heading } from "~/components/heading";
import { PageLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { api } from "~/utils/api";

import type { NextPage } from "next";

const GameHeading = (props: {
  name?: string;
  publisher?: string;
  releaseYear?: number;
}) => {
  return (
    <>
      <div>{`${props.name} (${props.releaseYear})`.toUpperCase()}&nbsp;</div>
      <div className="inline-flex gap-1">
        <div>©</div>
        <div>{`${props.publisher}`.toUpperCase()}</div>
      </div>
    </>
  );
};

const HomePage: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data } = api.carousel.getRandomGame.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // TODO: add skeleton loading
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <PageLayout>
      <Container className="-mt-[84px] flex min-h-screen flex-col pt-[84px] md:-mt-[96px] md:pt-[96px]">
        <Card
          className="flex max-w-full grow flex-col justify-between rounded-3xl bg-cover bg-center bg-no-repeat px-2 pb-2 pt-4 md:rounded-4xl md:p-6"
          style={{
            backgroundImage: `url(${data.imageUrl})`,
          }}
        >
          {/* TODO: add link to game page */}
          <div className="px-8 text-center text-neutral-100/60 md:inline-flex md:gap-1 md:px-0 md:text-left">
            <GameHeading {...data} />
          </div>

          <div className="flex flex-col items-center">
            <Card className="min-w-full px-5 pb-6 pt-8 md:px-12 md:pb-12 md:pt-11">
              <Heading
                className={{ container: "text-center md:text-left" }}
                size="lg"
              >
                Track your gaming journey
              </Heading>

              <div className="mx-1.5 mt-5 flex flex-col items-end justify-between md:mx-0 md:mt-10 md:flex-row">
                <div className="max-w-2xl text-center text-sm md:text-left md:text-xl/6">
                  Show everyone what games you love, share your thoughts and
                  experiences and connect with a passionate gaming community.
                </div>

                {!sessionData && (
                  <div className="mt-9 min-w-full text-center md:mt-0 md:min-w-fit">
                    <Button
                      as="a"
                      href="/auth/sign-up"
                      className="w-full md:w-56"
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
