import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from monorepo root (two levels up from apps/frontend)
  const env = loadEnv(mode, path.resolve(__dirname, "../.."), "");

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5173,
    },
    envDir: path.resolve(__dirname, "../.."),
    // Expose env variables to the client (only those prefixed with VITE_)
    define: {
      "process.env.POSTGRES_USER": JSON.stringify(env.POSTGRES_USER),
      "process.env.POSTGRES_DB": JSON.stringify(env.POSTGRES_DB),
      "process.env.DATABASE_URL": JSON.stringify(env.DATABASE_URL),
    },
  };
});
