import { type PropsWithChildren } from "react";
import Navbar from "~/components/navbar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col pb-2 md:pb-8">
      <Navbar />

      {children}
    </div>
  );
}
