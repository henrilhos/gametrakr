import { Suspense } from "react";
import Explorer from "~/app/search/_components/explorer";
import LoadingUsers from "~/app/search/[query]/users/_components/loading";
import Users from "~/app/search/[query]/users/_components/users";

export default function Page() {
  return (
    <div className="flex flex-col gap-8 px-3 md:px-8">
      <Explorer />

      <Suspense fallback={<LoadingUsers />}>
        <Users />
      </Suspense>
    </div>
  );
}
