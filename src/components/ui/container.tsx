import { cn } from "~/utils/cn";

import type { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const Container = ({ className, children }: ContainerProps) => {
  return <div className={cn("md:px-16 md:pb-16", className)}>{children}</div>;
};
