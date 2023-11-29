import Link from "next/link";
import { notFound } from "next/navigation";
import SignUpButton from "~/components/auth/sign-up-button";
import Heading from "~/components/heading";
import { Card } from "~/components/ui/card";
import { getCurrentUser } from "~/lib/session";

export function getGame() {
  const games = [
    {
      imageUrl: "/images/goty/alan-wake-ii.webp",
      name: "Alan Wake II",
      slug: "alan-wake-ii",
      publisher: "Remedy Entertainment",
      releaseYear: "2023",
    },
    {
      imageUrl: "/images/goty/baldurs-gate-3.webp",
      name: "Baldur's Gate 3",
      slug: "baldurs-gate-3",
      publisher: "Larian Studios",
      releaseYear: "2023",
    },
    {
      imageUrl: "/images/goty/marvels-spider-man-2.webp",
      name: "Marvel's Spider-Man 2",
      slug: "marvels-spider-man-2",
      publisher: "Insomniac Games",
      releaseYear: "2023",
    },
    {
      imageUrl: "/images/goty/resident-evil-4--1.webp",
      name: "Resident Evil 4",
      slug: "resident-evil-4--1",
      publisher: "Capcom Development Division 1",
      releaseYear: "2023",
    },
    {
      imageUrl: "/images/goty/super-mario-bros-wonder.webp",
      name: "Super Mario Bros. Wonder",
      slug: "super-mario-bros-wonder",
      publisher: "Nintendo EPD",
      releaseYear: "2023",
    },
    {
      imageUrl: "/images/goty/the-legend-of-zelda-tears-of-the-kingdom.webp",
      name: "The Legend of Zelda: Tears of the Kingdom",
      slug: "the-legend-of-zelda-tears-of-the-kingdom",
      publisher: "Nintendo EPD Production Group No. 3",
      releaseYear: "2023",
    },
  ];

  return { game: games[Math.floor(Math.random() * games.length)]! };
}

function GameInfo({
  name,
  publisher,
  releaseYear,
  slug,
}: {
  name: string;
  publisher: string;
  releaseYear: string;
  slug: string;
}) {
  return (
    <Link href={`/games/${slug}`}>
      <div className="px-8 text-center uppercase text-neutral-100/80  hover:underline md:inline-flex md:gap-1 md:px-0 md:text-left">
        <div>{`${name} (${releaseYear})`}&nbsp;</div>
        <div className="inline-flex gap-1">
          <div>©</div>
          <div>{`${publisher}`}</div>
        </div>
      </div>
    </Link>
  );
}

export default async function Page() {
  const user = await getCurrentUser();
  const { game } = getGame();

  if (!game) {
    notFound();
  }

  return (
    <div className="flex grow px-2 md:px-8">
      <Card
        className="flex max-w-full grow flex-col justify-between rounded-3xl bg-cover bg-center bg-no-repeat px-2 pb-2 pt-4 md:rounded-4xl md:p-6"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.00) 50%), url(${game.imageUrl})`,
        }}
      >
        <GameInfo {...game} />

        <div className="flex flex-col items-center">
          <Card className="min-w-full px-5 pb-6 pt-8 md:px-12 md:pb-12 md:pt-11">
            <Heading
              size="lg"
              className={{ container: "text-center md:text-left" }}
            >
              Track your gaming journey
            </Heading>

            <div className="mx-1.5 mt-5 flex flex-col items-end justify-between md:mx-0 md:mt-10 md:flex-row">
              <div className="max-w-2xl text-center text-base/tight md:text-left md:text-xl/tight">
                Show everyone what games you love, share your thoughts and
                experiences and connect with a passionate gaming community.
              </div>

              {!user && (
                <div className="mt-9 min-w-full text-center md:mt-0 md:min-w-fit">
                  <SignUpButton
                    content="Get started"
                    className="w-full md:w-56"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}
