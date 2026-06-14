import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // For when you add a components folder
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
      // This protects your max-w-* classes from breaking due to the spacing overrides
      maxWidth: {
        "xl": "36rem",    // 576px
        "2xl": "42rem",   // 672px
        "5xl": "64rem",   // 1024px
        "1440px": "1440px"
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};

export default config;