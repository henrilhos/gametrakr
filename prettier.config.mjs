/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  $schema: "https://json.schemastore.org/prettierrc",
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    /**
     * If you're adding more plugins, keep in mind
     * that the Tailwind plugin must come last!
     */
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "<BUILTIN_MODULES>",
    "",
    "^(~/.*)$",
    "^[.]",
    "",
    "<TYPES>",
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
  tailwindAttributes: ["classes"],
  tailwindFunctions: ["clsx", "cn", "cva", "twMerge"],
};

export default config;
