import { Suspense } from "react";
import Explorer from "~/app/search/_components/explorer";
import Games from "~/app/search/[query]/games/_components/games";
import LoadingGames from "~/app/search/[query]/games/_components/loading";

export default function Page() {
  return (
    <div className="flex flex-col gap-8 px-8">
      <Explorer />

      <Suspense fallback={<LoadingGames />}>
        <Games />
      </Suspense>
    </div>
  );
}
