/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io", pathname: "**" },
      { protocol: "https", hostname: "uploadthing.com", pathname: "**" },
      { protocol: "https", hostname: "images.igdb.com", pathname: "**" },
    ],
  },
  experimental: {},
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

/**
 * @param {string} _phase
 * @param {{ _defaultConfig: import('next').NextConfig }} _options
 */
const configWithPlugins = async (_phase, { _defaultConfig }) => {
  /* Dynamically import plugins from devDependencies to reduce bundle size */

  const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
    enabled: Boolean(process.env.ANALYZE),
  });

  return withBundleAnalyzer(config);
};

export default configWithPlugins;
