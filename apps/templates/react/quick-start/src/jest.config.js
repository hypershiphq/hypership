module.exports = {
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Use ts-jest to transform TypeScript files
    "^.+\\.(js|jsx)$": "babel-jest", // Transforms JavaScript files using Babel
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)", // Add modules that require transformation here
  ],
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy", // Mock CSS imports for testing
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"], // Extend Jest with additional matchers
};
