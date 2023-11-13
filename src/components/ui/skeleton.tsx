import { cn } from "~/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-neutral-800/10 dark:bg-neutral-200/10",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
