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
  // Create postgres connection
  const queryClient = postgres(connectionString);
  
  // Create Drizzle instance with schema
  const db = drizzle(queryClient, { schema });
  
  return db;
}

/**
 * Type for the database client
 */
export type DatabaseClient = ReturnType<typeof createDatabaseClient>;

