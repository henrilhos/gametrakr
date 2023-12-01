import { type PropsWithChildren } from "react";
import Navbar from "~/components/navbar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="md:max-auto flex min-h-screen w-full flex-col px-3 md:container">
      <Navbar />

      {children}
    </div>
  );
}
