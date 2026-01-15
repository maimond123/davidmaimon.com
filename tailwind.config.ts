import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0E13",
        surface: "#14181F",
        line: "#1A1F29",
        lime: "#FFFFFF",
        ice: "#BFE9FF",
        text: "#E8F1EA",
      },
      boxShadow: {
        glow: "0 0 24px rgba(255,255,255,.15)",
      },
      fontFamily: {
        // wired via next/font in layout
        sans: ["var(--font-inter)"],
        display: ["var(--font-space)"],
        mono: ["var(--font-jet)"],
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

