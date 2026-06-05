import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#fef2f2',
          100: '#ffe1e5',
          200: '#ffc8cf',
          300: '#ff9da9',
          400: '#ff6477',
          500: '#ff1f3f',
          600: '#C41E3A',
          700: '#a61730',
          800: '#8b172e',
          900: '#75172d',
          950: '#400714',
        },
        gold: {
          50: '#fdf8ed',
          100: '#f9edcc',
          200: '#f3d994',
          300: '#ecc15c',
          400: '#D4A853',
          500: '#c6922e',
          600: '#a67224',
          700: '#85541f',
          800: '#6f441f',
          900: '#5f391e',
          950: '#361d0d',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        chinese: ['var(--font-chinese)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
