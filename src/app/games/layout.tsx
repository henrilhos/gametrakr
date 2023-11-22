import { type PropsWithChildren } from "react";
import Navbar from "~/components/navbar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen w-full flex-col pb-4 md:pb-6">
      <Navbar />

      {children}
    </div>
  );
}
