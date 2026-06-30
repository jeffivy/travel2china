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
          50: '#fdf5f4',
          100: '#fceae8',
          200: '#f7d4ce',
          300: '#eeb0a6',
          400: '#e28a7c',
          500: '#d46858',
          600: '#B3423A',
          700: '#9A362E',
          800: '#812E28',
          900: '#6C2824',
          950: '#3A1210',
        },
        gold: {
          50: '#fcf8f1',
          100: '#f7eedb',
          200: '#efdbb3',
          300: '#e2c484',
          400: '#d4ad5e',
          500: '#B8944E',
          600: '#a07d3e',
          700: '#846534',
          800: '#6e522e',
          900: '#5c4429',
          950: '#332316',
        },
        surface: "var(--surface)",
        muted: "var(--muted)",
        border: "var(--border)",
        card: "var(--card)",
        'card-hover': "var(--card-hover)",
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
