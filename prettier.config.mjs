/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  $schema: "https://json.schemastore.org/prettierrc",
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "^~/public/(.*)$",
    "^~/",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  tailwindAttributes: ["classes"],
  tailwindFunctions: ["clsx", "cn", "cva", "twMerge"],
};

export default config;
