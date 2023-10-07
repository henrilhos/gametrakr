/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  $schema: "https://json.schemastore.org/prettierrc",
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^react$",
    "^next$",
    "^(next)(/.*)$",
    "",
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
};

export default config;
