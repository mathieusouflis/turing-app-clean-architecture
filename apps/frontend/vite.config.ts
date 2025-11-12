import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig(() => {
  return {
    plugins: [
      tanstackRouter({
        // target: "react",
        // autoCodeSplitting: true,
        routesDirectory: "./src/app",
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
    },
    envDir: path.resolve(__dirname, "../.."),
  };
});
