export default {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {
      // Only add necessary prefixes
      flexbox: "no-2009",
      grid: "autoplace",
    },
    ...(process.env.NODE_ENV === "production"
      ? {
          cssnano: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
                minifyFontValues: { removeQuotes: true },
                colormin: true,
                reduceIdents: true,
                mergeRules: true,
                mergeLonghand: true,
                discardDuplicates: true,
                discardEmpty: true,
              },
            ],
          },
        }
      : {}),
  },
};
