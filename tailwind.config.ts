import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          green: "#39ff14",
          orange: "#ff5f1f",
        },
        carbon: {
          50: "#f5f5f5",
          100: "#e0e0e0",
          200: "#cccccc",
          300: "#b3b3b3",
          400: "#999999",
          500: "#808080", // concrete
          600: "#666666",
          700: "#4d4d4d",
          800: "#333333",
          900: "#1a1a1a", // nearly black
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        "concrete-texture": "url('/textures/concrete.png')", // Placeholder for texture
        "grid-pattern": "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
