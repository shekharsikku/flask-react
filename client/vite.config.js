/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

const envDir = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(envDir, ".env") });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: envDir,
  server: {
    proxy: {
      "/api/user/": "http://localhost:8070",
      "/api/post/": "http://localhost:8070",
    },
  },
  preview: {
    proxy: {
      "/api/user/": "http://localhost:8080",
      "/api/post/": "http://localhost:8080",
    },
  },
  build: {
    outDir: "../dist", // create static file dist folder in root
  },
});
