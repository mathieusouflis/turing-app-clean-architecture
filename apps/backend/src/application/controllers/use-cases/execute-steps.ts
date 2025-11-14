/**
 * Execute Step Use Case
 * Executes a single step of the Turing machine
 */

import { Tape } from "../../../domain/tape.js";
import { TuringMachine } from "../../../domain/turing-machine.js";
import { TapeRepository } from "../../../infrastructure/database/index.js";
import type { TapeRecord } from "../../../infrastructure/database/index.js";

export class ExecuteStepUseCase {
  constructor(private repository: TapeRepository) {}

  /**
   * Executes a single step of the Turing machine
   * @param id - UUID of the tape
   * @returns Updated tape record or null if not found
   */
  async execute(id: string): Promise<TapeRecord | null> {
    // Load tape from database
    const record = await this.repository.get(id);
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

    // Execute one step
    machine.executeStep();

    // Save updated state back to database
    const updated = await this.repository.update(id, {
      content: tape.getContent(),
      headPosition: tape.getHeadPosition(),
      currentState: machine.getCurrentState(),
    });

    return updated;
  }
}
