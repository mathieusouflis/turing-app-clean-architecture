import { TapeRepository } from "../../infrastructure/database/repository.js";
import { Tape } from "../../domain/tape.js";
import { TuringMachine, Transition } from "../../domain/turing-machine.js";

/**
 * Default tape for unary addition machine
 */
const DEFAULT_TAPE_CONTENT = "______1";

/**
 * Application: Reset Tape Use Case
 * Resets the tape to its initial state (defaults to unary addition machine initial state)
 */
export class ResetTapeUseCase {
  constructor(private repository: TapeRepository) {}

  async execute(id: string, initialContent?: string, headPosition?: number): Promise<{
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

    // Reset to provided values or default unary addition machine state
    const resetContent = initialContent !== undefined ? initialContent : DEFAULT_TAPE_CONTENT;
    const resetHeadPos = headPosition !== undefined ? headPosition : 0;

    machine.reset(resetContent, resetHeadPos);

    // Update database - reset to initial state
    await this.repository.update(id, {
      content: tape.getContent(),
      head_position: tape.getHeadPosition(),
      current_state: tapeRecord.initial_state, // Reset to initial state
    });

    return {
      content: tape.getContent(),
      headPosition: tape.getHeadPosition(),
      currentState: machine.getCurrentState(),
    };
  }
}

