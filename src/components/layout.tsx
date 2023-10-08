import { useRouter } from "next/router";

import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

import { Header } from "~/components/header";
import { Heading } from "~/components/heading";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main>{props.children}</main>
    </>
  );
};

type DialogLayoutProps = PropsWithChildren<{
  className?: { card?: string };
}>;
export const DialogLayout = ({ className, children }: DialogLayoutProps) => {
  return (
    <main className="flex min-h-screen min-w-full items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <Card
        className={clsx(
          "min-h-[100vh] min-w-[100vw] rounded-none px-7 pb-5 pt-10 text-center md:my-8 md:min-h-fit md:min-w-[31rem] md:max-w-[31rem] md:rounded-[2rem] md:px-14 md:pb-10",
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
    <DialogLayout className={className}>
      <div>
        <CardHeader>
          <div className="text-left">
            <button
              type="button"
              className="inline-flex text-lg font-bold leading-5"
              onClick={() => void router.back()}
            >
              <FontAwesomeIcon icon={faCaretLeft} className="mr-1.5" />
              <div>BACK</div>
            </button>
          </div>

          <CardTitle className="mt-6 text-left">{title}</CardTitle>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </div>

      <CardFooter>
        <Heading size="sm">gametrakr</Heading>
      </CardFooter>
    </DialogLayout>
  );
};
