import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ include: ["src"] })],
  css: {
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        server: resolve(__dirname, "src/server.ts"),
        styles: resolve(__dirname, "src/styles.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "next/headers",
        "jose",
        "crypto",
        "buffer",
        "stream",
        "util",
      ],
      output: {
        assetFileNames: "style.css",
        entryFileNames: "[name].js",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        manualChunks: undefined,
        inlineDynamicImports: true,
        minifyInternalExports: true,
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.trace",
        ],
      },
    },
    sourcemap: false,
    reportCompressedSize: true,
  },
});
