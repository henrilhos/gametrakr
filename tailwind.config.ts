import { fontFamily } from "tailwindcss/defaultTheme";

import colors from "./src/styles/colors";

import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
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
      fontFamily: {
        sans: ["Atkinson Hyperlegible", ...fontFamily.sans],
        serif: ["Apfel Grotezk", ...fontFamily.serif],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      aspectRatio: {
        "game-cover": "3 / 4",
      },
      // TODO: Check if they're used
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        enter: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.9)", opacity: "0" },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        enter: "enter 200ms ease-out",
        leave: "leave 150ms ease-in forwards",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
    require("tailwindcss-inner-border"),
  ],
} satisfies Config;
