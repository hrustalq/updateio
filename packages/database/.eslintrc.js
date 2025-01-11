module.exports = {
  root: true,
  extends: ["@repo/eslint-config-common/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  ignorePatterns: [
    "tsup.config.ts",
    ".eslintrc.js",
    "dist",
    "node_modules"
  ],
}; 