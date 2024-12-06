import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // Entry file
  format: ["esm", "cjs"], // Output formats
  dts: true, // Generate TypeScript declaration files
  external: ["react", "react-dom", "./src/index.css"], // Externalize React and React-DOM
  clean: true, // Clean output directory before building
  sourcemap: true, // Optional: Enable source maps
});
