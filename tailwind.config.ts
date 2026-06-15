import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#E4321B",
          ink: "#111111",
          yellow: "#FFD400",
          paper: "#FFFFFF",
          muted: "#F4ECE6",
        },
      },
      fontFamily: {
        display: ["var(--font-anton)", "Impact", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        offset: "8px 8px 0 0 #111111",
        "offset-yellow": "8px 8px 0 0 #FFD400",
        "offset-sm": "4px 4px 0 0 #111111",
        "offset-white": "8px 8px 0 0 #FFFFFF",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
