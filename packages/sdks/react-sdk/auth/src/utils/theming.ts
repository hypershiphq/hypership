/**
 * Maps common Tailwind/Next-themes theme class names to CSS custom properties
 * @param element The element to apply the CSS variables to (default: document.documentElement)
 */
export const applyThemeVariables = (
  element: HTMLElement = document.documentElement
): void => {
  const isDark =
    element.classList.contains("dark") ||
    document.body.classList.contains("dark") ||
    element.getAttribute("data-theme") === "dark" ||
    localStorage.getItem("theme") === "dark" ||
    (localStorage.getItem("theme") === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Define theme variables
  const themeVariables = {
    // Text colors
    "--hs-text-primary": isDark ? "#e5e7eb" : "#1f2937",
    "--hs-text-secondary": isDark ? "#9ca3af" : "#4b5563",

    // Background colors
    "--hs-bg-primary": isDark ? "#111827" : "#ffffff",
    "--hs-bg-secondary": isDark ? "#1f2937" : "#f3f4f6",
    "--hs-bg-elevated": isDark ? "#374151" : "#ffffff",

    // Border colors
    "--hs-border-color": isDark ? "#374151" : "#e5e7eb",

    // Button colors
    "--hs-button-primary-bg": isDark ? "#3b82f6" : "#2563eb",
    "--hs-button-primary-text": isDark ? "#ffffff" : "#ffffff",
    "--hs-button-secondary-bg": isDark ? "#1f2937" : "#f3f4f6",
    "--hs-button-secondary-text": isDark ? "#e5e7eb" : "#1f2937",

    // Input colors
    "--hs-input-bg": isDark ? "#111827" : "#ffffff",
    "--hs-input-border": isDark ? "#374151" : "#d1d5db",
    "--hs-input-text": isDark ? "#e5e7eb" : "#1f2937",
    "--hs-input-placeholder": isDark ? "#6b7280" : "#9ca3af",

    // Error/Success colors
    "--hs-error": isDark ? "#ef4444" : "#dc2626",
    "--hs-success": isDark ? "#10b981" : "#059669",
  };

  // Apply CSS variables to the element
  Object.entries(themeVariables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
};

/**
 * Observes changes to document theme and applies theme variables
 * This function sets up observers for both Tailwind and next-themes
 */
export const observeThemeChanges = (): (() => void) => {
  // Initial application
  applyThemeVariables();

  // Set up mutation observer for class changes (Tailwind)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.attributeName === "class" ||
        mutation.attributeName === "data-theme"
      ) {
        applyThemeVariables();
      }
    });
  });

  // Observe both html and body for class changes
  observer.observe(document.documentElement, { attributes: true });
  observer.observe(document.body, { attributes: true });

  // Listen for storage events (next-themes)
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "theme") {
      applyThemeVariables();
    }
  };

  window.addEventListener("storage", handleStorageChange);

  // Listen for system preference changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleMediaChange = () => {
    if (localStorage.getItem("theme") === "system") {
      applyThemeVariables();
    }
  };

  mediaQuery.addEventListener("change", handleMediaChange);

  // Return cleanup function
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", handleStorageChange);
    mediaQuery.removeEventListener("change", handleMediaChange);
  };
};
