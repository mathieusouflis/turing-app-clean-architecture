import { eq } from "drizzle-orm";
import { DatabaseClient } from "./client.js";
import { tapes, type TapeRecord, type NewTapeRecord } from "./schema.js";

/**
 * Repository for tape operations using Drizzle ORM
 * Implements CRUD operations following Clean Architecture principles
 */
export class TapeRepository {
  constructor(private db: DatabaseClient) {}

  /**
   * Initialize database schema
   * Creates the tapes table if it doesn't exist
   */
  async initialize(): Promise<void> {
    // Drizzle migrations handle schema creation
    // This method can be used for additional setup if needed
    // For now, use `pnpm db:push` or `pnpm db:migrate` to create tables
  }

  /**
   * Create a new tape record
   * @param data - Tape data to insert
   * @returns Created tape record
   */
  async create(data: NewTapeRecord): Promise<TapeRecord> {
    const [record] = await this.db.insert(tapes).values(data).returning();
    return record;
  }

  /**
   * Find a tape by ID
   * @param id - UUID of the tape
   * @returns Tape record or null if not found
   */
  async findById(id: string): Promise<TapeRecord | null> {
    const [record] = await this.db
      .select()
      .from(tapes)
      .where(eq(tapes.id, id))
      .limit(1);
    
    return record || null;
  }

  /**
   * Update a tape record
   * @param id - UUID of the tape to update
   * @param data - Partial tape data to update
   * @returns Updated tape record or null if not found
   */
  async update(
    id: string,
    data: Partial<Omit<NewTapeRecord, "id" | "createdAt">>
  ): Promise<TapeRecord | null> {
    const [record] = await this.db
      .update(tapes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tapes.id, id))
      .returning();
    
    return record || null;
  }

  /**
   * Delete a tape record
   * @param id - UUID of the tape to delete
   * @returns true if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    const [deleted] = await this.db
      .delete(tapes)
      .where(eq(tapes.id, id))
      .returning();
    
    return deleted !== undefined;
  }

  /**
   * Find all tapes (optional - for future use)
   * @returns Array of all tape records
   */
  async findAll(): Promise<TapeRecord[]> {
    return await this.db.select().from(tapes);
  }
}

