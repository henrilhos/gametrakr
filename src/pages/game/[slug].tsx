import { useEffect, useState } from "react";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";

import { Heading } from "../../components/heading";
import { PageLayout } from "../../components/layout";
import { generateServerSideHelpers } from "../../server/helpers/ssgHelper";
import { api } from "../../utils/api";

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
            className="h-[320px] w-full rounded-2xl bg-center"
            style={{ backgroundImage: `url(${header})` }}
          />
          <div className="mt-8 grid grid-cols-12">
            <div className="col-span-6 col-start-4">
              <Heading>{data.name}</Heading>

              <div className="mt-10 flex justify-between text-xl">
                <div>
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(data.releaseDate)}
                </div>
                <div>{data.developers.join(", ")}</div>
              </div>

              <div className="mt-14 text-xl text-neutral-700">
                {data.summary}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssh = generateServerSideHelpers();
  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  await ssh.game.getBySlug.prefetch({ slug });

  return {
    props: {
      trpcState: ssh.dehydrate(),
      slug,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default GamePage;
