import { useSession } from "next-auth/react";

import { Heading } from "~/components/heading";
import { PageLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Container } from "~/components/ui/container";

import type { GetStaticProps, NextPage } from "next";

type Game = {
  imageUrl: string;
  name: string;
  publisher: string;
  releaseYear: string;
};

const GameHeading = (props: {
  name: string;
  publisher: string;
  releaseYear: string;
}) => {
  return (
    <>
      <div>{`${props.name} (${props.releaseYear})`}&nbsp;</div>
      <div className="inline-flex gap-1">
        <div>©</div>
        <div>{`${props.publisher}`}</div>
      </div>
    </>
  );
};

const HomePage: NextPage<{ game: Game }> = ({ game }) => {
  const { data: sessionData } = useSession();

  return (
    <PageLayout>
      <Container className="-mt-[84px] flex min-h-screen flex-col pt-[84px] md:-mt-[96px] md:pt-[96px]">
        <Card
          className="flex max-w-full grow flex-col justify-between rounded-3xl bg-cover bg-center bg-no-repeat px-2 pb-2 pt-4 md:rounded-4xl md:p-6"
          style={{
            backgroundImage: `url(${game.imageUrl})`,
          }}
        >
          {/* TODO: add link to game page */}
          <div className="px-8 text-center uppercase text-black/60 md:inline-flex  md:gap-1 md:px-0 md:text-left md:text-neutral-100/60">
            <GameHeading {...game} />
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
                <div className="max-w-2xl text-center text-base/tight md:text-left md:text-xl/tight">
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

export const getStaticProps: GetStaticProps = () => {
  const games: Game[] = [
    {
      imageUrl: "https://i.imgur.com/d1SnqRH.jpg",
      name: "Song of Nunu: A League of Legends Story",
      publisher: "Tequila Works",
      releaseYear: "2023",
    },
  ];

  const game = games[Math.floor(Math.random() * games.length)]!;

  return {
    props: {
      game,
    },
  };
};

export default HomePage;
