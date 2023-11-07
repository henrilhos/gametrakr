import { useRouter } from "next/router";

import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Header } from "~/components/header";
import { Heading } from "~/components/heading";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/utils/cn";

import type { PropsWithChildren } from "react";

type PageLayoutProps = PropsWithChildren<{
  className?: string;
}>;
export const PageLayout = (props: PageLayoutProps) => {
  return (
    <>
      <Header />
      <main className={cn("h-full w-full pt-[72px] md:pt-24", props.className)}>
        {props.children}
      </main>
    </>
  );
};

type DialogLayoutProps = PropsWithChildren<{
  className?: { card?: string };
}>;
export const DialogLayout = ({ className, children }: DialogLayoutProps) => {
  return (
    <main className="flex min-h-screen min-w-full items-center justify-center bg-black/20 backdrop-blur-sm dark:bg-white/20">
      <Card
        className={cn(
          "h-screen w-screen rounded-none px-7 pb-7 pt-10 text-center md:m-8 md:h-fit md:max-w-lg md:rounded-4xl md:px-14 md:py-10",
          className?.card,
        )}
      >
        {children}
      </Card>
    </main>
  );
};

type AuthPageLayoutProps = PropsWithChildren<
  {
    title: string;
  } & DialogLayoutProps
>;
export const AuthPageLayout = ({
  children,
  title,
  className,
}: AuthPageLayoutProps) => {
  const router = useRouter();

  return (
    <DialogLayout className={{ card: cn(className?.card, "flex gap-6") }}>
      <div className="flex flex-col gap-12">
        <CardHeader className="gap-6">
          <div className="text-left text-neutral-900 dark:text-slate-100">
            <button
              type="button"
              className="inline-flex text-lg/5 font-bold"
              onClick={() => void router.back()}
            >
              <FontAwesomeIcon icon={faCaretLeft} className="mr-1.5" />
              <div>BACK</div>
            </button>
          </div>

          <CardTitle className="text-left text-black dark:text-white">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </div>

      <CardFooter>
        <Heading size="sm">gametrakr</Heading>
      </CardFooter>
    </DialogLayout>
  );
};
