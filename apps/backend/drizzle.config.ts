import { dbConfig } from "@/config/db.config";
import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit configuration for migrations
 * Generates SQL migrations from schema changes
 */
export default defineConfig({
  schema: "./src/modules/index.schemas.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.databaseName}`,
  },
});
