import { useEffect, useState } from "react";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { Heading } from "~/components/heading";
import { PageLayout } from "~/components/layout";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";

const GamePage: NextPage<{ slug: string }> = ({ slug }) => {
  const [header, setHeader] = useState("");
  const { data } = api.game.getBySlug.useQuery({ slug });

  useEffect(() => {
    if (!data?.images || !!header) return;

    setHeader(data.images[Math.floor(Math.random() * data.images.length)]!);
  }, [data?.images, header]);

  if (!data) return <div>404</div>;

  // const header = data.images[Math.floor(Math.random() * data.images.length)]!;

  return (
    <>
      <Head>
        <title>{`${data?.name} | gametrakr`}</title>
      </Head>

      <PageLayout>
        <div className="mx-8">
          <div
            className="relative h-[320px] w-full rounded-2xl bg-center"
            style={{ backgroundImage: `url(${header})` }}
          >
            <Image
              width={280}
              height={372}
              alt={data.name}
              className="absolute left-0 top-0 ml-[36px] mt-[160px] rounded-2xl"
              src={data.cover}
            />
          </div>

          <div className="mt-8 grid grid-cols-12">
            <div className="col-span-7 col-start-4 flex flex-col gap-8">
              <div className="flex justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {data.genres.map((genre) => (
                    <div
                      key={genre}
                      className="rounded-[40px] bg-yellow-100 px-4 py-2 text-sm uppercase text-yellow-600"
                    >
                      {genre}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {data.platforms.map((platform) => (
                    <div
                      key={platform}
                      className="rounded-[40px] bg-yellow-100 px-4 py-2 text-sm uppercase text-yellow-600"
                    >
                      {platform}
                    </div>
                  ))}
                </div>
              </div>

              <Heading>{data.name}</Heading>

              <div className="flex justify-between text-xl">
                <div>
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(data.releaseDate)}
                </div>
                <div>{data.developers.join(", ")}</div>
              </div>

              <div className="text-xl text-neutral-700">{data.summary}</div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = ssgHelper();
  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  await ssg.game.getBySlug.prefetch({ slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default GamePage;
