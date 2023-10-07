import Head from "next/head";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { Header } from "~/components/header";
import { api } from "~/utils/api";

import type { Session } from "next-auth";
import type { AppType } from "next/app";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Head>
          <title>gametrakr</title>
          {/* TODO: update description */}
          <meta name="description" content="🎮" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
