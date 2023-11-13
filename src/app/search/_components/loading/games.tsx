import { Skeleton } from "~/components/ui/skeleton";

export default function LoadingGames() {
  return (
    <div className="grid min-h-[344px] gap-4 md:grid-cols-3">
      <div className="col-span-1 flex flex-col gap-2">
        <Skeleton className="h-[24px] w-[114px]" />

        <Skeleton className="h-full w-full rounded-2xl" />
      </div>

      <div className="col-span-1 flex flex-col gap-2 md:col-span-2">
        <div className="flex h-[24px] justify-between">
          <Skeleton className="h-full w-[74px]" />
          <Skeleton className="h-full w-[100px]" />
        </div>

        <div className="grid h-full gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton className="h-full w-full rounded-2xl" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
