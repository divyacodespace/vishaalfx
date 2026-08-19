import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#05070d",
          900: "#0a0e17",
          850: "#0f1420",
          800: "#141b2b",
          700: "#1c2536",
          600: "#2a3549",
        },
        accent: {
          DEFAULT: "#22d3ee",
          soft: "#67e8f9",
          dim: "#0e7490",
        },
        gain: "#34d399",
        loss: "#f87171",
        warn: "#fbbf24",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "system-ui",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["SF Mono", "ui-monospace", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.15), 0 8px 30px rgba(34,211,238,0.08)",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
