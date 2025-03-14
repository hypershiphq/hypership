/**
 * This file exists to allow importing the CSS separately.
 * When consumers of this package want to just import the styles without the components,
 * they can import from '@hypership/auth-react/styles'
 */
import "./index.css";

// Re-export any theme utilities that might be useful for styling integration
export { applyThemeVariables, observeThemeChanges } from "./utils/theming";
