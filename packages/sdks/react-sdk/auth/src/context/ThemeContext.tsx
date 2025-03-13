import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to get initial theme
const getInitialTheme = (): Theme => {
  // Check if we're in the browser
  if (typeof window !== "undefined") {
    // Check localStorage first (for persistent preference)
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
      return storedTheme;
    }

    // Check for Tailwind dark class
    if (document.documentElement.classList.contains("dark")) {
      return "dark";
    }

    // Check for next-themes
    const dataTheme = document.documentElement.getAttribute(
      "data-theme"
    ) as Theme | null;
    if (dataTheme && ["light", "dark"].includes(dataTheme)) {
      return dataTheme;
    }
  }

  // Default to system
  return "system";
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Effect to update the theme in the DOM and localStorage
  useEffect(() => {
    const applyTheme = (newTheme: "light" | "dark") => {
      // Apply theme to document
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Update state
      setResolvedTheme(newTheme);
    };

    // Handle theme changes
    if (theme === "system") {
      // For system theme, check media query
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        applyTheme(mediaQuery.matches ? "dark" : "light");
      };

      // Initial check
      handleChange();

      // Listen for changes
      mediaQuery.addEventListener("change", handleChange);

      // Save to localStorage
      localStorage.setItem("theme", "system");

      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // For explicit themes
      applyTheme(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // The context value
  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
