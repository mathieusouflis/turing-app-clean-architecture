import { PostgresDb } from "@fastify/postgres";
import { Transition } from "../../domain/turing-machine.js";

/**
 * Database representation of a tape
 */
export interface TapeRecord {
  id: string;
  content: string;
  head_position: number;
  current_state: string;
  transitions: Transition[];
  initial_state: string;
  final_states: string[];
  created_at: Date;
  updated_at: Date;
}

/**
 * Data for creating a new tape
 */
export interface CreateTapeData {
  content?: string;
  head_position?: number;
  current_state?: string;
  transitions?: Transition[];
  initial_state?: string;
  final_states?: string[];
}

/**
 * Infrastructure: PostgreSQL Repository
 * Handles all database operations for tapes
 */
export class TapeRepository {
  constructor(private pg: PostgresDb) {}

  /**
   * Initialize database schema
   */
  async initialize(): Promise<void> {
    const client = await this.pg.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS tapes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          content TEXT NOT NULL DEFAULT '______1',
          head_position INTEGER NOT NULL DEFAULT 0,
          current_state TEXT NOT NULL DEFAULT 'A',
          transitions JSONB NOT NULL DEFAULT '[]'::jsonb,
          initial_state TEXT NOT NULL DEFAULT 'A',
          final_states TEXT[] NOT NULL DEFAULT ARRAY['HALT']::TEXT[],
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_tapes_created_at ON tapes(created_at);
      `);
    } finally {
      client.release();
    }
  }

  /**
   * Create a new tape
   */
  async create(data: CreateTapeData): Promise<TapeRecord> {
    const client = await this.pg.connect();
    try {
      const result = await client.query<TapeRecord>(
        `INSERT INTO tapes (
          content, 
          head_position, 
          current_state, 
          transitions, 
          initial_state, 
          final_states
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          data.content || "______1",
          data.head_position ?? 0,
          data.current_state || "A",
          JSON.stringify(data.transitions || []),
          data.initial_state || "A",
          data.final_states || ["HALT"],
        ]
      );

      return this.mapRowToRecord(result.rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Get tape by ID
   */
  async findById(id: string): Promise<TapeRecord | null> {
    const client = await this.pg.connect();
    try {
      const result = await client.query<TapeRecord>(
        "SELECT * FROM tapes WHERE id = $1",
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToRecord(result.rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Update tape
   */
  async update(id: string, data: Partial<CreateTapeData>): Promise<TapeRecord | null> {
    const client = await this.pg.connect();
    try {
      const updates: string[] = [];
      const values: unknown[] = [];
      let paramIndex = 1;

      if (data.content !== undefined) {
        updates.push(`content = $${paramIndex++}`);
        values.push(data.content);
      }
      if (data.head_position !== undefined) {
        updates.push(`head_position = $${paramIndex++}`);
        values.push(data.head_position);
      }
      if (data.current_state !== undefined) {
        updates.push(`current_state = $${paramIndex++}`);
        values.push(data.current_state);
      }
      if (data.transitions !== undefined) {
        updates.push(`transitions = $${paramIndex++}`);
        values.push(JSON.stringify(data.transitions));
      }
      if (data.initial_state !== undefined) {
        updates.push(`initial_state = $${paramIndex++}`);
        values.push(data.initial_state);
      }
      if (data.final_states !== undefined) {
        updates.push(`final_states = $${paramIndex++}`);
        values.push(data.final_states);
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      updates.push(`updated_at = NOW()`);
      values.push(id);

      const result = await client.query<TapeRecord>(
        `UPDATE tapes SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToRecord(result.rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Delete tape by ID
   */
  async delete(id: string): Promise<boolean> {
    const client = await this.pg.connect();
    try {
      const result = await client.query("DELETE FROM tapes WHERE id = $1", [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  /**
   * Map database row to TapeRecord
   */
  private mapRowToRecord(row: any): TapeRecord {
    return {
      id: row.id,
      content: row.content,
      head_position: row.head_position,
      current_state: row.current_state,
      transitions: Array.isArray(row.transitions) ? row.transitions : JSON.parse(row.transitions || "[]"),
      initial_state: row.initial_state,
      final_states: Array.isArray(row.final_states) ? row.final_states : row.final_states || [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}

