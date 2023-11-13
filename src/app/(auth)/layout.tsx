import { type PropsWithChildren } from "react";
import Heading from "~/components/heading";
import { Card, CardFooter } from "~/components/ui/card";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen min-w-full flex-col items-center justify-center bg-black/20 backdrop-blur-sm dark:bg-white/20">
      <Card className="flex h-screen w-screen gap-6 rounded-none px-7 pb-7 pt-10 text-center md:m-8 md:h-fit md:max-w-lg md:rounded-4xl md:px-14 md:py-10">
        {children}

        <CardFooter>
          <Heading size="sm">gametrakr</Heading>
        </CardFooter>
      </Card>
    </div>
  );
}
