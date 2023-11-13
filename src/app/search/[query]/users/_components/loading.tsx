import { Skeleton } from "~/components/ui/skeleton";

export default function LoadingUsers() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-[24px] justify-between">
        <Skeleton className="h-[24px] w-[60px]" />
      </div>

      <div className="grid min-h-[752px] grow gap-4 md:grid-cols-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <Skeleton className="h-full w-full rounded-2xl" key={i} />
        ))}
      </div>
    </div>
  );
}
