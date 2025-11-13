/**
 * Delete Tape Use Case
 * Deletes a tape by ID
 */

import { TapeRepository } from "../../../infrastructure/database/index.js";

export class DeleteTapeUseCase {
  constructor(private repository: TapeRepository) {}

  /**
   * Deletes a tape by ID
   * @param id - UUID of the tape
   * @returns true if deleted, false if not found
   */
  async execute(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
