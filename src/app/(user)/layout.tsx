import { PropsWithChildren } from "react";
import Navbar from "~/components/navbar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen w-full flex-col px-3 md:container md:mx-auto">
      <Navbar />

      {children}
    </div>
  );
}
