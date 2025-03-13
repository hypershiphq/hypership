import React from "react";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { useTheme } from "../../../context/ThemeContext";
import { useDarkMode } from "../../../hooks/useThemedStyles";

export const ThemeExample: React.FC = () => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = useDarkMode();

  return (
    <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Theme Settings</h2>
        <ThemeToggle />
      </div>

      <div className="space-y-3">
        <p>
          <span className="font-medium">Selected theme:</span>{" "}
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
            {theme}
          </span>
        </p>
        <p>
          <span className="font-medium">Resolved theme:</span>{" "}
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
            {resolvedTheme}
          </span>
        </p>
        <p>
          <span className="font-medium">Dark mode active:</span>{" "}
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
            {isDark ? "Yes" : "No"}
          </span>
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 rounded bg-primary text-white">Primary Color</div>
        <div className="p-4 rounded bg-primary-dark text-white">
          Primary Dark
        </div>

        <div className="p-4 rounded border border-gray-200 dark:border-gray-700">
          Border Light/Dark
        </div>
        <div className="p-4 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          Background Light/Dark
        </div>

        <div className="p-4 rounded bg-red-600 dark:bg-red-500 text-white">
          Error Light/Dark
        </div>
        <div className="p-4 rounded bg-green-600 dark:bg-green-500 text-white">
          Success Light/Dark
        </div>
      </div>
    </div>
  );
};
