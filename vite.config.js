import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
  },
  // Add base path for assets
  base: "./",
  // Ensure optimized dependencies are properly built
  optimizeDeps: {
    include: ["axios", "react-router-dom"],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
