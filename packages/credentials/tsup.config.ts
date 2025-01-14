import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development'
  },
  platform: 'browser',
  target: 'es2020',
}); 