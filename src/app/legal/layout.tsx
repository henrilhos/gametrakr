import { type PropsWithChildren } from "react";
import { type Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
} from "~/app/shared-metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Legal - gametrakr",
  twitter: {
    ...twitterMetadata,
    title: "Legal - gametrakr",
  },
  openGraph: {
    ...ogMetadata,
    title: "Legal - gametrakr",
  },
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="container mx-auto flex h-full w-full flex-col items-center justify-center gap-y-6 py-4 md:py-8">
      <div className="w-full max-w-3xl rounded-lg border px-3 py-4 md:px-6 md:py-8">
        <article className="prose dark:prose-invert prose-headings:font-apfel-grotezk prose-p:text-sm">
          {children}
        </article>
      </div>
    </div>
  );
}
