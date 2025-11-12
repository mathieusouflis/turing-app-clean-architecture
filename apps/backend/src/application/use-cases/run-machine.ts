import { TapeRepository } from "../../infrastructure/database/repository.js";
import { Tape } from "../../domain/tape.js";
import { TuringMachine, Transition } from "../../domain/turing-machine.js";

/**
 * Application: Run Machine Use Case
 * Executes multiple steps of the Turing machine
 */
export class RunMachineUseCase {
  constructor(private repository: TapeRepository) {}

  async execute(id: string, maxSteps: number = 1000): Promise<{
    stepsExecuted: number;
    halted: boolean;
    reason?: string;
    content: string;
    headPosition: number;
    currentState: string;
  }> {
    const tapeRecord = await this.repository.findById(id);

    if (!tapeRecord) {
      throw new Error(`Tape with id ${id} not found`);
    }

    // Reconstruct domain objects from database record
    const tape = new Tape(tapeRecord.content, tapeRecord.head_position);
    const machine = new TuringMachine(
      tape,
      tapeRecord.transitions as Transition[],
      tapeRecord.initial_state,
      tapeRecord.final_states
    );

    // Set current state
    machine.setCurrentState(tapeRecord.current_state);

    // Execute steps
    const result = machine.executeSteps(maxSteps);

    // Update database with new state
    await this.repository.update(id, {
      content: tape.getContent(),
      head_position: tape.getHeadPosition(),
      current_state: machine.getCurrentState(),
    });

    return {
      stepsExecuted: result.stepsExecuted,
      halted: result.halted,
      reason: result.reason,
      content: tape.getContent(),
      headPosition: tape.getHeadPosition(),
      currentState: machine.getCurrentState(),
    };
  }
}

