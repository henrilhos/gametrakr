import { Skeleton } from "~/components/ui/skeleton";

export default function LoadingUsers() {
  return (
    <div className="flex min-h-[212px] flex-col gap-2">
      <div className="flex h-[24px] justify-between">
        <Skeleton className="h-full w-[60px]" />
        <Skeleton className="h-full w-[100px]" />
      </div>

      <div className="grid h-full grow gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton className="h-full w-full rounded-2xl" key={i} />
        ))}
      </div>
    </div>
  );
}
