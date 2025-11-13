/**
 * Reset Tape Use Case
 * Resets a tape to its initial state
 */

import { Tape } from "../../../domain/tape.js";
import { TuringMachine } from "../../../domain/turing-machine.js";
import { TapeRepository } from "../../../infrastructure/database/index.js";
import type { TapeRecord } from "../../../infrastructure/database/index.js";

export class ResetTapeUseCase {
  constructor(private repository: TapeRepository) {}

  /**
   * Resets a tape to its initial state
   * @param id - UUID of the tape
   * @returns Updated tape record or null if not found
   */
  async execute(id: string): Promise<TapeRecord | null> {
    // Load tape from database
    const record = await this.repository.findById(id);
    if (!record) {
      return null;
    }

    // Reconstruct domain objects
    const tape = new Tape(record.content, record.headPosition);
    const machine = new TuringMachine(
      tape,
      record.currentState,
      record.transitions,
      record.finalStates
    );

    // Reset to initial state using stored initialContent
    machine.reset(record.initialContent, 0);

    // Save updated state back to database
    const updated = await this.repository.update(id, {
      content: tape.getContent(),
      headPosition: tape.getHeadPosition(),
      currentState: machine.getInitialState(),
    });

    return updated;
  }
}
