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
    ringColor: false,
    ringOffsetColor: false,
    ringOffsetWidth: false,
    ringOpacity: false,
    ringWidth: false,
    tableLayout: false,
  },
  // Only include the utilities we actually use
  safelist: [
    // Colors
    "bg-white/95",
    "bg-black/95",
    "bg-black/40",
    "bg-blue-500",
    "bg-blue-600",
    "bg-gray-200",
    "bg-gray-300",
    "bg-gray-800",
    "bg-gray-700",
    // Text colors
    "text-white",
    "text-gray-900",
    "text-gray-700",
    "text-gray-200",
    "text-gray-800",
    "text-gray-300",
    "text-blue-500",
    "text-blue-600",
    // Border colors
    "border-blue-500",
    "border-blue-600",
    // Ring
    "ring-1",
    "ring-black/10",
    "ring-white/10",
    // Positioning
    "fixed",
    "inset-0",
    "inset-x-0",
    "bottom-4",
    "left-4",
    // Flexbox
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "justify-between",
    "gap-2",
    "gap-3",
    "gap-4",
    // Spacing
    "p-4",
    "p-6",
    "px-3",
    "py-1.5",
    "py-2.5",
    // Width/Height
    "w-full",
    "w-80",
    "max-w-lg",
    "max-w-2xl",
    // Typography
    "text-xs",
    "text-sm",
    "text-lg",
    "font-medium",
    "font-semibold",
    // Transitions
    "transition-all",
    "duration-200",
    "duration-500",
    // Transforms
    "scale-95",
    "scale-100",
    "translate-y-full",
    "translate-y-0",
    "-translate-y-2",
    // Effects
    "backdrop-blur-sm",
    "backdrop-saturate-150",
    // Misc
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "rounded-md",
    "z-[99999]",
  ],
};
