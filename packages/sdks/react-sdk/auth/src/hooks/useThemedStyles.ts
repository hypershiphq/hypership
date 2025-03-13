import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

type StyleMap<T> = {
  light: T;
  dark: T;
};

/**
 * A hook that applies theme-based styles based on the detected theme
 * @param styles An object containing light and dark variants of styles
 * @returns The appropriate styles based on the current theme
 */
export const useThemedStyles = <T>(styles: StyleMap<T>): T => {
  const { resolvedTheme } = useTheme();

  // Return the appropriate styles based on the theme
  return useMemo(() => {
    return styles[resolvedTheme];
  }, [resolvedTheme, styles]);
};

/**
 * A hook that returns a themed class name based on the detected theme
 * @param lightClasses The Tailwind classes to use in light mode
 * @param darkClasses The Tailwind classes to use in dark mode (these will be automatically added to dark: variants)
 * @returns A combined class string for use with className prop
 */
export const useThemedClassName = (
  baseClasses: string,
  lightClasses?: string,
  darkClasses?: string
): string => {
  return useMemo(() => {
    // For Tailwind, we don't need to check the theme - we rely on the dark: class variants
    // This allows the theme to change without component re-renders
    const classes = [baseClasses];

    if (lightClasses) classes.push(lightClasses);
    if (darkClasses) {
      // We add dark classes without dark: prefix as Tailwind will handle it via the .dark parent class
      classes.push(darkClasses);
    }

    return classes.filter(Boolean).join(" ");
  }, [baseClasses, lightClasses, darkClasses]);
};

/**
 * A hook that returns a boolean indicating if dark mode is active
 * @returns true if dark mode is active, false otherwise
 */
export const useDarkMode = (): boolean => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark";
};
