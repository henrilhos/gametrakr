import path, { resolve } from "path"
import type { StorybookConfig } from "@storybook/nextjs"

const config: StorybookConfig = {
  framework: {
    name: "@storybook/nextjs",
    options: {
      nextConfigPath: resolve(__dirname, "../next.config.mjs"),
    },
  },
  stories: ["../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  docs: {
    autodocs: true,
  },
  webpackFinal: async (config, { configType }) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "~": path.resolve(__dirname, "../src"),
      }
    }

    return config
  },
}
export default config
