import type { Config } from "tailwindcss";

const withOpacity = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: withOpacity("--ivory"),
        sand: withOpacity("--sand"),
        ink: withOpacity("--ink"),
        forest: withOpacity("--forest"),
        gold: withOpacity("--gold"),
        stone: withOpacity("--stone"),
      },
      fontFamily: {
        // Priskiriami per next/font layout.tsx (CSS kintamieji)
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: { content: "1200px" },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
