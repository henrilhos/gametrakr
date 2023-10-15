import { fontFamily } from "tailwindcss/defaultTheme";

import colors from "./src/styles/colors";

import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        heading: "linear-gradient(0, rgb(var(--heading)) 45%, transparent 0%)",
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
        // DEPRECATED
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        error: {
          DEFAULT: "rgb(var(--error))",
          foreground: "rgb(var(--error-foreground))",
        },
        success: {
          DEFAULT: "rgb(var(--success))",
          foreground: "rgb(var(--success-foreground))",
        },
        oldneutral: {
          DEFAULT: "rgb(var(--neutral))",
          foreground: "rgb(var(--neutral-foreground))",
        },
        info: {
          DEFAULT: "rgb(var(--info))",
          foreground: "rgb(var(--info-foreground))",
        },
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        label: "rgb(var(--label))",
        ring: "rgb(var(--ring))",
      },
      fontFamily: {
        apfel: ["Apfel Grotezk", "sans-serif"],
        sans: ["Atkinson Hyperlegible", ...fontFamily.sans],
        serif: ["Apfel Grotezk", ...fontFamily.serif],
      },
      // TODO: Check if they're used
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
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
