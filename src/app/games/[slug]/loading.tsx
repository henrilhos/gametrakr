import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 px-8">
      <Skeleton className="h-56 w-full rounded-4xl" />

      <div className="grid gap-6 px-8 md:grid-cols-12">
        <div className="relative col-span-3 -mt-56 w-full min-w-fit 2xl:col-span-2">
          <Skeleton className="aspect-game-cover h-auto w-full rounded-2xl" />
        </div>

        <div className="col-span-6 flex w-full flex-col gap-8 2xl:col-span-8">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-[30px] w-16 rounded-2xl" />
            <Skeleton className="h-[30px] w-16 rounded-2xl" />
            <Skeleton className="h-[30px] w-16 rounded-2xl" />
          </div>

          <Skeleton className="h-[42px] w-96" />

          <div className="inline-flex gap-20">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>

        <div className="col-span-3 w-full 2xl:col-span-2">
          <Skeleton className="h-[220px] w-full rounded-4xl" />
        </div>
      </div>
    </div>
  );
}
