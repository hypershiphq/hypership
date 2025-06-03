export default {
  plugins: {
    "postcss-prefix-selector": {
      prefix: ".hypership-auth-wrapper",
      transform(prefix, selector) {
        if (selector.startsWith("html")) return prefix;
        return `${prefix} ${selector}`;
      },
    },
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {
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
