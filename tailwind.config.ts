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
        neev: {
          // Canvas Background
          ivory: {
            DEFAULT: "#FAF8F5",
            card: "#FFFFFF",
            subtle: "#F5F1EA",
            muted: "#ECE6DC",
            border: "#E2DACD",
          },
          // Primary Brand & Trust
          forest: {
            DEFAULT: "#1B4332",
            900: "#10281E",
            800: "#1B4332",
            700: "#245A43",
            600: "#2D7054",
            100: "#D6E5DE",
            50: "#EEF5F2",
          },
          // Primary CTA Buttons
          terracotta: {
            DEFAULT: "#C85A32",
            hover: "#B04D28",
            active: "#984121",
            light: "#FDF2EE",
            border: "#F3C5B5",
          },
          // Progress Bars & Accents
          amber: {
            DEFAULT: "#D99B26",
            hover: "#BF871F",
            light: "#FEF7E9",
            border: "#F4D9A1",
          },
          // Text & Ink
          charcoal: {
            DEFAULT: "#1F2421",
            secondary: "#333A36",
          },
          slate: {
            DEFAULT: "#5C6660",
            light: "#78847D",
            muted: "#9AA59F",
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      boxShadow: {
        "warm-sm": "0 1px 3px 0 rgba(31, 36, 33, 0.05)",
        "warm-md": "0 4px 12px 0 rgba(31, 36, 33, 0.07)",
        "warm-lg": "0 10px 25px -3px rgba(31, 36, 33, 0.08), 0 4px 6px -2px rgba(31, 36, 33, 0.03)",
        "warm-xl": "0 20px 35px -5px rgba(31, 36, 33, 0.1), 0 10px 10px -5px rgba(31, 36, 33, 0.04)",
      },
      borderRadius: {
        "neev-sm": "8px",
        "neev-md": "14px",
        "neev-lg": "20px",
        "neev-xl": "28px",
      },
    },
  },
  plugins: [],
};

export default config;

