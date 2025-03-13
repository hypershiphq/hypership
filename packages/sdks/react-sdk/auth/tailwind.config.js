/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // Blue
          dark: "#3b82f6",
        },
        bg: {
          light: "#ffffff",
          dark: "#111827",
        },
        text: {
          light: "#1f2937",
          dark: "#e5e7eb",
        },
        border: {
          light: "#e5e7eb",
          dark: "#374151",
        },
        input: {
          light: "#ffffff",
          dark: "#111827",
        },
        error: {
          light: "#dc2626",
          dark: "#ef4444",
        },
        success: {
          light: "#059669",
          dark: "#10b981",
        },
      },
    },
  },
  plugins: [],
};
