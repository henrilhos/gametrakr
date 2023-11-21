import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 px-3 md:px-8">
      <Skeleton className="hidden h-56 w-full rounded-4xl md:block" />

      <div className="grid grid-cols-12 gap-6 px-3 md:grid-cols-12 md:px-8">
        <div className="relative col-span-12 flex w-full min-w-fit justify-center md:col-span-3 md:-mt-56 md:block 2xl:col-span-2">
          <Skeleton className="aspect-game-cover h-auto w-1/2 rounded-2xl md:w-full" />
        </div>

        <div className="col-span-12 flex w-full flex-col items-center gap-8 md:col-span-6 md:items-start 2xl:col-span-8">
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

          <div className="hidden w-full gap-1 md:flex md:flex-col">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>

        <div className="col-span-12 w-full md:col-span-3 2xl:col-span-2">
          <Skeleton className="h-[220px] w-full rounded-4xl" />
        </div>

        <div className="col-span-12 flex flex-col gap-1 md:hidden">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
    </div>
  );
}
