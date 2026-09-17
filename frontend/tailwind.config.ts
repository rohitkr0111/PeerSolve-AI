
import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#e0f7ff",
          200: "#b3eaff",
          300: "#80ddff",
          400: "#4dd0ff",
          500: "#1ac3ff",
          600: "#0099cc",
          700: "#006699",
          800: "#003366",
          900: "#001a33",
        },
        accent: {
          100: "#f0e6ff",
          200: "#d9b3ff",
          300: "#c280ff",
          400: "#ab4dff",
          500: "#961aff",
          600: "#7a00cc",
          700: "#5e0099",
          800: "#420066",
          900: "#260033",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
} satisfies Config;
