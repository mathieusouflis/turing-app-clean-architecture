/**
 * Get Tape Use Case
 * Retrieves a tape by ID
 */

import { TapeRepository } from "../../infrastructure/database/index.js";
import type { TapeRecord } from "../../infrastructure/database/index.js";

export class GetTapeUseCase {
  constructor(private repository: TapeRepository) {}

  /**
   * Gets a tape by ID
   * @param id - UUID of the tape
   * @returns Tape record or null if not found
   */
  async execute(id: string): Promise<TapeRecord | null> {
    return await this.repository.findById(id);
  }
}

