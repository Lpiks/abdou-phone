import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        phone: {
          void: "#090A0D",
          surface: "#13161D",
          "surface-elevated": "#181C25",
          "surface-hover": "#1E232F",
          border: "#252A36",
          "border-light": "#353D4E",
          frost: "#F8FAFC",
          muted: "#94A3B8",
          dim: "#64748B",
          emerald: {
            DEFAULT: "#10B981",
            light: "#34D399",
            dark: "#059669",
            glow: "rgba(16, 185, 129, 0.15)",
          },
          danger: "#EF4444",
          amber: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "SF Mono", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(16, 185, 129, 0.2)",
        card: "0 8px 30px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
