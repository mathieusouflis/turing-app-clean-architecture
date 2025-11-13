import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../.env.dev");
dotenv.config({ path: envPath });

/**
 * Drizzle Kit configuration for migrations
 * Generates SQL migrations from schema changes
 */
export default defineConfig({
  schema: "./src/infrastructure/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: `postgresql://${process.env.DB_USER || "root"}:${process.env.DB_PASSWORD || "root"}@localhost:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "turing_machine"}`,
  },
});
