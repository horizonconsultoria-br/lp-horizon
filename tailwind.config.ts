import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Espelha tokens.css para usabilidade Tailwind direta
        "hzn-bg": {
          base: "#0b0d12",
          raised: "#131720",
          overlay: "#1a2030",
          muted: "#0e1117",
        },
        "hzn-text": {
          primary: "#f5f5f5",
          secondary: "#a8acba",
          muted: "#6b7280",
          inverse: "#0b0d12",
        },
        "hzn-brand": {
          50: "#fef3c7",
          100: "#fde68a",
          200: "#fcd34d",
          300: "#fbbf24",
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
          700: "#92400e",
        },
        "hzn-border": {
          subtle: "#1f2937",
          default: "#2a3344",
          strong: "#3a4660",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      maxWidth: {
        container: "1200px",
      },
      boxShadow: {
        "amber-glow": "0 0 24px rgba(245, 158, 11, 0.35)",
        "amber-glow-strong": "0 0 48px rgba(245, 158, 11, 0.6)",
      },
      animation: {
        "fade-up": "fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
