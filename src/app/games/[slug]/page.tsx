import { Suspense } from "react";
import GameContainer from "~/app/games/_components/game";
import { getCurrentUser } from "~/lib/session";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-8 px-8">
      <Suspense fallback={<span>Loading...</span>}>
        <GameContainer user={user} />
      </Suspense>
    </div>
  );
}
