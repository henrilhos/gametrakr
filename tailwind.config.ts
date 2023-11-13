import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { withUt } from "uploadthing/tw";
import colors from "./src/styles/colors";

export default withUt({
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-atkinson-hyperlegible)", ...fontFamily.sans],
        "apfel-grotezk": ["var(--font-apfel-grotezk)"],
      },
      colors: {
        inherit: colors.inherit,
        current: colors.current,
        transparent: colors.transparent,
        black: colors.black,
        white: colors.white,
        yellow: colors.yellow,
        teal: colors.teal,
        green: colors.green,
        blue: colors.blue,
        violet: colors.violet,
        pink: colors.pink,
        red: colors.red,
        orange: colors.orange,
        neutral: colors.neutral,
        slate: colors.slate,
      },
      borderRadius: {
        "4xl": "2rem",
      },
      aspectRatio: {
        "game-cover": "3 / 4",
      },
      // TODO: check if they're used
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("tailwindcss-inner-border"),
  ],
}) satisfies Config;
