import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

/**
 * Database client factory
 * Creates a Drizzle ORM instance connected to PostgreSQL
 * 
 * @param connectionString - PostgreSQL connection string
 * @returns Drizzle database instance
 */
export function createDatabaseClient(connectionString: string) {
  const queryClient = postgres(connectionString);
  
  const db = drizzle(queryClient, { schema });
  
  return db;
}

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;

