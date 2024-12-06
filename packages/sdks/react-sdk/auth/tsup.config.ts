import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // Single entry point
  format: ["esm", "cjs"], // Output formats
  dts: true, // Generate TypeScript declaration files
  clean: true, // Clean the dist folder
  sourcemap: true, // Generate source maps
  external: ["react", "react-dom"], // Externalize dependencies
  splitting: false, // Disable code splitting for a single bundled output
  minify: true, // Optional: Minify the output
});
