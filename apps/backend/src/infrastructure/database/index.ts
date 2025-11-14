/**
 * Database Infrastructure Layer
 * Provides database client and repository exports
 * This file bridges the old structure with the new modular structure
 */

import { TapeRepository as ModularTapeRepository } from "../../modules/tape/infrastructure/repositories/postgresql";
import type { TapeRecord, NewTapeRecord } from "../../modules/tape/shemas/tape";

/**
 * Creates a database client from a connection URL
 * Parses the URL and returns a client instance
 * @param databaseUrl - PostgreSQL connection string (e.g., postgresql://user:password@host:port/dbname)
 * @returns Database client instance
 */
export function createDatabaseClient(databaseUrl: string): any {
  // Parse the database URL
  const url = new URL(databaseUrl);
  const username = url.username || "postgres";
  const password = url.password || "postgres";
  const host = url.hostname || "localhost";
  const port = parseInt(url.port || "5432", 10);
  const dbName = url.pathname.slice(1) || "turing_machine";

  // Return a client-like object that can be used with TapeRepository
  return {
    username,
    password,
    host,
    port,
    dbName,
  };
}

/**
 * TapeRepository adapter
 * Adapts the modular TapeRepository to work with the old API
 */
export class TapeRepository {
  private repository: ModularTapeRepository;

  constructor(db?: any) {
    // If db is already a ModularTapeRepository, use it directly
    if (db instanceof ModularTapeRepository) {
      this.repository = db;
    } else if (db) {
      // Otherwise, create a new repository with the parsed credentials
      this.repository = new ModularTapeRepository(
        db.username || db.user || process.env.DB_USER || "postgres",
        db.password || process.env.DB_PASSWORD || "postgres",
        db.host || process.env.DB_HOST || "localhost",
        db.port || Number(process.env.DB_PORT) || 5432,
        db.dbName || db.database || process.env.DB_NAME || "turing_machine"
      );
    } else {
      // Use environment variables if no db provided
      this.repository = new ModularTapeRepository(
        process.env.DB_USER || "postgres",
        process.env.DB_PASSWORD || "postgres",
        process.env.DB_HOST || "localhost",
        Number(process.env.DB_PORT) || 5432,
        process.env.DB_NAME || "turing_machine"
      );
    }
  }

  async create(data: NewTapeRecord): Promise<TapeRecord> {
    return this.repository.create(data);
  }

  async get(id: string): Promise<TapeRecord | null> {
    try {
      return await this.repository.get(id);
    } catch (error) {
      return null;
    }
  }

  async findById(id: string): Promise<TapeRecord | null> {
    return this.get(id);
  }

  async getAll(): Promise<TapeRecord[]> {
    return this.repository.getAll();
  }

  async update(
    id: string,
    data: Partial<Omit<TapeRecord, "id" | "createdAt">>
  ): Promise<TapeRecord> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    try {
      const tape = await this.repository.get(id);
      if (!tape) {
        return false;
      }
      await this.repository.delete(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Re-export types
export type { TapeRecord, NewTapeRecord };

