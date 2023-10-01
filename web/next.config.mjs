// @ts-check

import { env } from "./src/env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: env.NODE_ENV === "production" ? "standalone" : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

/**
 * @param {string} phase
 * @param {{ defaultConfig: import('next').NextConfig }} options
 */
const nextConfigWithPlugins = async (phase, { defaultConfig }) => {
  /* Dynamically import plugins from devDependencies to reduce bundle size */
  const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
    enabled: env.ANALYZE,
  })

  return withBundleAnalyzer(nextConfig)
}

export default nextConfigWithPlugins
