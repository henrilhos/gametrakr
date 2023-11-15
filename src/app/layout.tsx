import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { type PropsWithChildren } from "react";
import { type Viewport } from "next";
import LocalFont from "next/font/local";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import ClientProviders from "~/app/client-providers";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
} from "~/app/shared-metadata";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import "~/styles/globals.css";

config.autoAddCss = false;

const apfelGrotezk = LocalFont({
  src: [
    {
      path: "../../public/fonts/ApfelGrotezk-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ApfelGrotezk-Fett.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-apfel-grotezk",
});

const atkinsonHyperlegible = LocalFont({
  src: [
    {
      path: "../../public/fonts/AtkinsonHyperlegible-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/AtkinsonHyperlegible-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/AtkinsonHyperlegible-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/AtkinsonHyperlegible-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-atkinson-hyperlegible",
});

export const metadata = {
  ...defaultMetadata,
  twitter: {
    ...twitterMetadata,
  },
  openGraph: {
    ...ogMetadata,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${apfelGrotezk.variable} ${atkinsonHyperlegible.variable} font-sans`}
      >
        <ClientProviders cookies={cookies().toString()}>
          {children}
        </ClientProviders>

        <TailwindIndicator />
        <Analytics />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
