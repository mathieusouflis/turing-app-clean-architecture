import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

import dotenv from "dotenv";

export default defineConfig(() => {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });

  if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: path.resolve(__dirname, "../../.env.prod") });
  } else if (process.env.NODE_ENV === "development") {
    dotenv.config({ path: path.resolve(__dirname, "../../.env.dev") });
  }

  return {
    plugins: [
      tanstackRouter({
        routesDirectory: "./src/app",
        generatedRouteTree: "./src/routeTree.gen.ts",
        routeFileIgnorePrefix: "-",
        quoteStyle: "single",
        autoCodeSplitting: true,
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
    envDir: path.resolve(__dirname, "../../"),
    define: {
      "process.env": process.env,
    },
  };
});
