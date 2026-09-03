import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EAF3FB",
          100: "#D4E8F7",
          200: "#A9D0EF",
          300: "#7EB8E6",
          400: "#3A8ED6",
          500: "#1565C0",
          600: "#114E96",
          700: "#0D2A4A",
          800: "#0A223C",
          900: "#081B30",
        },
        accent: {
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD54F",
          400: "#F4C542",
          500: "#F2B705",
          600: "#C49000",
        },
        ink: "#17212B",
        muted: "#5E6B76",
        border: "#D9E2EA",
        surface: "#FAFCFE",
      },
      fontFamily: {
        sans: ["Inter","ui-sans-serif","system-ui","sans-serif"],
        display: ["Plus Jakarta Sans","Inter","sans-serif"],
      },
      boxShadow: {
        card: "0 2px 16px rgba(13,42,74,0.08)",
        elevated: "0 8px 32px rgba(13,42,74,0.12)",
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.25rem' },
    },
  },
  plugins: [],
};
export default config;
