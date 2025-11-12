import { TapeRepository, CreateTapeData } from "../../infrastructure/database/repository.js";
import { Tape } from "../../domain/tape.js";
import { Transition } from "../../domain/turing-machine.js";

/**
 * Default tape for unary addition machine: ["_", "_", "_", "_", "_", "_", "1"]
 * _ represents 1 in unary notation
 */
const DEFAULT_TAPE_CONTENT = "______1";

/**
 * Default transitions for unary addition machine:
 * - A + _ → write 1, move right (→), stay in A
 * - A + 1 → write 1, no move, go to HALT
 */
const DEFAULT_TRANSITIONS: Transition[] = [
  {
    currentState: "A",
    readSymbol: "_",
    writeSymbol: "1",
    moveDirection: "R",
    nextState: "A",
  },
  {
    currentState: "A",
    readSymbol: "1",
    writeSymbol: "1",
    moveDirection: "R", // Will be handled as "no move" in the machine logic
    nextState: "HALT",
  },
];

/**
 * Application: Create Tape Use Case
 * Creates a tape with defaults matching the unary addition machine subject
 */
export class CreateTapeUseCase {
  constructor(private repository: TapeRepository) {}

  async execute(data: CreateTapeData): Promise<{ id: string; content: string; headPosition: number }> {
    const tapeRecord = await this.repository.create({
      content: data.content || DEFAULT_TAPE_CONTENT,
      head_position: data.head_position ?? 0,
      current_state: data.current_state || "A",
      transitions: data.transitions || DEFAULT_TRANSITIONS,
      initial_state: data.initial_state || "A",
      final_states: data.final_states || ["HALT"],
    });

    return {
      id: tapeRecord.id,
      content: tapeRecord.content,
      headPosition: tapeRecord.head_position,
    };
  }
}

