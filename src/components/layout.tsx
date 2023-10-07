import { Header } from "~/components/header";

import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main>{props.children}</main>
    </>
  );
};
