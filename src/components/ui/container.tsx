import { cn } from "~/utils/cn";

import type { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const Container = ({ className, children }: ContainerProps) => {
  return <div className={cn("md:px-8 md:pb-8", className)}>{children}</div>;
};
