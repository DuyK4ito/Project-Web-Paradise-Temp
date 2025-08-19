import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7D0600",
        "primary-text": "var(--color-primary-text)",
        secondary: "#F3BE12",
        accent: "#FFF9F9",
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        sans: ["Roboto", "sans-serif"],
      },
      screens: {
        custom: "900px",
      },
    },
  },
  plugins: [],
} satisfies Config
