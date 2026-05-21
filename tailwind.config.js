/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: "#f9fafb",
          900: "#111827",
          950: "#030712",
        },
        indigo: {
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          900: "#312e81",
        },
        purple: {
          200: "#e9d5ff",
          600: "#9333ea",
          900: "#581c87",
        },
      },
    },
  },
  plugins: [],
};
