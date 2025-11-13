/**
 * Run Machine Use Case
 * Executes multiple steps of the Turing machine
 */

import { Tape } from "../../../domain/tape.js";
import { TuringMachine } from "../../../domain/turing-machine.js";
import { TapeRepository } from "../../../infrastructure/database/index.js";
import type { TapeRecord } from "../../../infrastructure/database/index.js";

export interface RunMachineRequest {
  maxSteps?: number;
}

export class RunMachineUseCase {
  constructor(private repository: TapeRepository) {}

  /**
   * Executes multiple steps of the Turing machine
   * @param id - UUID of the tape
   * @param options - Options including maxSteps (default: 1000)
   * @returns Updated tape record and steps executed, or null if not found
   */
  async execute(
    id: string,
    options: RunMachineRequest = {}
  ): Promise<{ tape: TapeRecord; stepsExecuted: number } | null> {
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

    // Execute multiple steps
    const maxSteps = options.maxSteps ?? 1000;
    const stepsExecuted = machine.run(maxSteps);

    // Save updated state back to database
    const updated = await this.repository.update(id, {
      content: tape.getContent(),
      headPosition: tape.getHeadPosition(),
      currentState: machine.getCurrentState(),
    });

    if (!updated) {
      return null;
    }

    return { tape: updated, stepsExecuted };
  }
}
