/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
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
  // Only include the utilities we actually use
};
