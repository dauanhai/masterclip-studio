/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090C",
        card: "#101217",
        panel: "#16181F",
        "panel-raised": "#1E212B",
        border: "#252936",
        brand: {
          DEFAULT: "#F59E0B",
          glow: "#FBBF24",
          dark: "#D97706",
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#F59E0B",
          600: "#D97706",
        },
        gold: {
          400: "#FCD34D",
          500: "#F59E0B",
          600: "#D97706",
        },
        neon: {
          magenta: "#FF007F",
          cyan: "#00F0FF",
          yellow: "#FFE600",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        }
      }
    },
  },
  plugins: [],
}
