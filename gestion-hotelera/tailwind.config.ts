import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "navy-dark": "#0f172a",
        "lavender-accent": "#e0e7ff",
        "lavender-deep": "#6366f1",
        "surface-dim": "#f8fafc",
        "on-primary": "#ffffff",
        "surface": "#ffffff",
        "primary": "#0f172a",
        "secondary": "#475569",
        "background": "#ffffff",
        "outline-variant": "#e2e8f0"
      },
      borderRadius: {
        "DEFAULT": "0px",
        "lg": "4px",
        "xl": "8px",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "64px",
        "sm": "16px",
        "xs": "8px",
        "lg": "32px",
        "md": "24px",
        "xl": "64px",
        "base": "4px",
        "margin-mobile": "20px",
        "gutter": "32px"
      },
      // SOLUCIÓN AL BUG DE HERENCIA: Forzamos la escala nativa de anchos máximos
      maxWidth: {
        "sm": "24rem",    // 384px
        "md": "28rem",    // 448px
        "lg": "32rem",    // 512px
        "xl": "36rem",    // 576px
        "2xl": "42rem",   // 672px
        "3xl": "48rem",   // 768px
        "4xl": "56rem",   // 896px
        "5xl": "64rem",   // 1024px
        "6xl": "72rem",   // 1152px
        "7xl": "80rem",   // 1280px
        "1440px": "1440px"
      },
      fontFamily: {
        "label-md": ["var(--font-hanken)"],
        "body-lg": ["var(--font-hanken)"],
        "headline-lg": ["var(--font-manrope)"],
        "headline-sm": ["var(--font-manrope)"],
        "body-sm": ["var(--font-hanken)"],
        "label-sm": ["var(--font-hanken)"],
        "headline-lg-mobile": ["var(--font-manrope)"],
        "headline-md": ["var(--font-manrope)"],
        "body-md": ["var(--font-hanken)"]
      }
    },
  },
  plugins: [
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/container-queries"),
  ],
};

export default config;