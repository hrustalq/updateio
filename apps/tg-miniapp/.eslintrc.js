/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config-frontend/next"],
  parserOptions: {
    project: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
  overrides: [
    {
      files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
      excludedFiles: ["*.config.js", "postcss.config.js", "tailwind.config.js"]
    }
  ]
};
