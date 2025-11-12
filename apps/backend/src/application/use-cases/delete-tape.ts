import { TapeRepository } from "../../infrastructure/database/repository.js";

/**
 * Application: Delete Tape Use Case
 */
export class DeleteTapeUseCase {
  constructor(private repository: TapeRepository) {}

  async execute(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }
}

