import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#e86c3b", dark: "#c9542c", soft: "#fff0e8" },
        canvas: "#f8f5f0",
        ink: "#25231f",
        herb: "#74876a",
      },
      fontFamily: {
        sans: ["Agrave Pro", "Manrope", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
export default config;
