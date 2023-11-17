import { Suspense } from "react";
import Explorer from "~/app/search/_components/explorer";
import Games from "~/app/search/_components/games";
import LoadingGames from "~/app/search/_components/loading/games";
import LoadingUsers from "~/app/search/_components/loading/users";
import Users from "~/app/search/_components/users";

function Loading() {
  return (
    <>
      <LoadingGames />
      <LoadingUsers />
    </>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col gap-8 px-3 md:px-8">
      <Explorer />

      <Suspense fallback={<Loading />}>
        <Games />
        <Users />
      </Suspense>
    </div>
  );
}
