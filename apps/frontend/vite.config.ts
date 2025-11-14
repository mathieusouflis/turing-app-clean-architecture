import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import fs from "fs";
import dotenv from "dotenv";

export default defineConfig(({ mode }) => {
  const rootDir = path.resolve(__dirname, "../../");

  const rootEnvPath = path.resolve(rootDir, ".env");
  let nodeEnv = mode || "development";

  if (fs.existsSync(rootEnvPath)) {
    const rootEnv = dotenv.parse(fs.readFileSync(rootEnvPath));
    nodeEnv = rootEnv.NODE_ENV || mode || "development";
  }

  const envFile = nodeEnv === "development" ? ".env.dev" : ".env.prod";
  const envFilePath = path.resolve(rootDir, envFile);

  let envVars: Record<string, string> = {};
  if (fs.existsSync(envFilePath)) {
    envVars = dotenv.parse(fs.readFileSync(envFilePath));
  }

  const defineEnv: Record<string, string> = {};

  Object.entries(envVars).forEach(([key, value]) => {
    if (key.startsWith("VITE_")) {
      defineEnv[`import.meta.env.${key}`] = JSON.stringify(value);
    }
  });

  defineEnv["import.meta.env.NODE_ENV"] = JSON.stringify(nodeEnv);

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
    envDir: rootDir,
    define: defineEnv,
  };
});
