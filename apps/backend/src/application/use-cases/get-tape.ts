import { TapeRepository } from "../../infrastructure/database/repository.js";

/**
 * Application: Get Tape Use Case
 */
export class GetTapeUseCase {
  constructor(private repository: TapeRepository) {}

  async execute(id: string): Promise<{
    id: string;
    content: string;
    headPosition: number;
    currentState: string;
    transitions: any[];
    initialState: string;
    finalStates: string[];
  } | null> {
    const tapeRecord = await this.repository.findById(id);

    if (!tapeRecord) {
      return null;
    }

    return {
      id: tapeRecord.id,
      content: tapeRecord.content,
      headPosition: tapeRecord.head_position,
      currentState: tapeRecord.current_state,
      transitions: tapeRecord.transitions,
      initialState: tapeRecord.initial_state,
      finalStates: tapeRecord.final_states,
    };
  }
}

