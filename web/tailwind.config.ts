import type { Config } from 'tailwindcss'

const config: Config = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        title: 'linear-gradient(0, #FFE5B2 45%, transparent 0%)',
        'dark-title': 'linear-gradient(0, #59431F 45%, transparent 0%)',
      },
      fontFamily: {
        atkinson: ['Atkinson Hyperlegible', 'sans-serif'],
        apfel: ['Apfel Grotezk', 'sans-serif'],
        sans: ['Atkinson Hyperlegible'],
      },
      colors: {
        white: '#FFFFFF',
        black: '#121212',
        yellow: {
          DEFAULT: '#F2A100',
          200: '#FFF0D1',
          300: '#FFE5B2',
          400: '#FFC44D',
          500: '#F2A100',
          600: '#BF7C1D',
          700: '#99661F',
          800: '#59431F',
        },
        gray: {
          DEFAULT: '#8C8C8C',
          200: '#F2F2F2',
          300: '#D9D9D9',
          400: '#BABABA',
          500: '#8C8C8C',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#121212',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-inner-border'),
  ],
}
export default config
