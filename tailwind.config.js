/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#00D8FF",
          DEFAULT: "#00A4C8",
          dark: "#007B94"
        },
        secondary: {
          light: "#FF4F5A",
          DEFAULT: "#D93A44",
          dark: "#B3252F"
        },
        background: {
          dark: "#0F1419",
          DEFAULT: "#1A2526",
          light: "#2A3439"
        },
        text: {
          DEFAULT: "#D9D9D9",
          muted: "#6B7A80"
        }
      }
    },
  },
  plugins: [],
} 