import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint"; // for showing the linting in console at build time as well as dev time.
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [eslintPlugin(), react()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  server: {
    host: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/_mantine";`,
      },
    },
  },
});
