import { ImageResponse } from "next/og";
import { DESCRIPTION, TITLE } from "~/app/shared-metadata";

export const runtime = "edge";

export async function GET(req: Request) {
  const apfelGrotezk = await fetch(
    new URL("../../../../public/fonts/ApfelGrotezk-Fett.otf", import.meta.url),
  ).then((res) => res.arrayBuffer());
  const atkinsonHyperlegible = await fetch(
    new URL(
      "../../../../public/fonts/AtkinsonHyperlegible-Regular.ttf",
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") ?? TITLE;
  const description = searchParams.get("description") ?? DESCRIPTION;

  return new ImageResponse(
    (
      <div tw="relative flex flex-col bg-white text-black items-center justify-center w-full h-full">
        <div tw="max-w-[75vw] relative flex flex-col">
          <h1 style={{ fontFamily: "Apfel Grotezk" }} tw="text-7xl">
            {title}
          </h1>
          <p
            style={{ fontFamily: "Atkinson Hyperlegible" }}
            tw="text-black/50 text-3xl"
          >
            {description.slice(0, 120).replace(/(<([^>]+)>)/gi, "")}
            {description.length > 120 ? "..." : ""}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          data: apfelGrotezk,
          name: "Apfel Grotezk",
          style: "normal",
          weight: 700,
        },
        {
          data: atkinsonHyperlegible,
          name: "Atkinson Hyperlegible",
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
