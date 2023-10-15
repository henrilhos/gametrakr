import { Head, Html, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html lang="en">
      <Head />
      <body className="dark:bg-slate bg-white text-black dark:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};
export default Document;
