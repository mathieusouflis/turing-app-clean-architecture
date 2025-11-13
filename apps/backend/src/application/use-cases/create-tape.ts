/**
 * Create Tape Use Case
 * Creates a new tape with default unary machine configuration
 */

import { TapeRepository, type NewTapeRecord } from "../../infrastructure/database/index.js";

export class CreateTapeUseCase {
  constructor(private repository: TapeRepository) {}

  /**
   * Creates a new tape with default unary machine configuration
   * Default: tape "______1", state "A", final "HALT"
   */
  async execute(): Promise<{ id: string }> {
    const defaultTransitions = [
      { currentState: "A", readSymbol: "_", writeSymbol: "_", moveDirection: "R" as const, nextState: "A" },
      { currentState: "A", readSymbol: "1", writeSymbol: "1", moveDirection: "R" as const, nextState: "B" },
      { currentState: "B", readSymbol: "_", writeSymbol: "1", moveDirection: "L" as const, nextState: "C" },
      { currentState: "B", readSymbol: "1", writeSymbol: "1", moveDirection: "R" as const, nextState: "B" },
      { currentState: "C", readSymbol: "_", writeSymbol: "_", moveDirection: "R" as const, nextState: "D" },
      { currentState: "C", readSymbol: "1", writeSymbol: "1", moveDirection: "L" as const, nextState: "C" },
      { currentState: "D", readSymbol: "_", writeSymbol: "1", moveDirection: "L" as const, nextState: "E" },
      { currentState: "D", readSymbol: "1", writeSymbol: "1", moveDirection: "R" as const, nextState: "D" },
      { currentState: "E", readSymbol: "_", writeSymbol: "_", moveDirection: "R" as const, nextState: "A" },
      { currentState: "E", readSymbol: "1", writeSymbol: "1", moveDirection: "L" as const, nextState: "E" },
    ];

    const initialContent = "______1";
    const newTape: NewTapeRecord = {
      content: initialContent,
      initialContent: initialContent,
      headPosition: 0,
      currentState: "A",
      transitions: defaultTransitions,
      initialState: "A",
      finalStates: ["HALT"],
    };

    const record = await this.repository.create(newTape);
    return { id: record.id };
  }
}

