/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // Blue-600 for light mode primary (was purple)
          dark: "#3b82f6", // Blue-500 for dark mode primary (was lighter purple)
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
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
    },
  },
  plugins: [],
  corePlugins: {
    // Disable features we don't use
    container: false,
    objectFit: false,
    objectPosition: false,
    overscroll: false,
    placeholderColor: false,
    placeholderOpacity: false,
    tableLayout: false,
  },
};
