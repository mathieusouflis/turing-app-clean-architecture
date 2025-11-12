import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit configuration for migrations
 * Generates SQL migrations from schema changes
 */
export default defineConfig({
  schema: "./src/infrastructure/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/turing_machine",
  },
});

