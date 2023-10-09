/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { env } from "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

/**
 * @param {string} _phase
 * @param {{ _defaultConfig: import('next').NextConfig }} _options
 */
const configWithPlugins = async (_phase, { _defaultConfig }) => {
  /* Dynamically import plugins from devDependencies to reduce bundle size */

  const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
    enabled: env.ANALYZE,
  });

  return withBundleAnalyzer(config);
};

export default configWithPlugins;
