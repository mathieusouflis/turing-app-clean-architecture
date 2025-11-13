import { NewTapeRecord } from "../shemas/tape";
import { TapeRepository } from "./repositories/postgresql";

export class TapeInterface {
  private repository: InstanceType<typeof TapeRepository>;

  constructor(repository: InstanceType<typeof TapeRepository>) {
    this.repository = repository;
  }

  async createTape(data: NewTapeRecord): Promise<any> {
    return await this.repository.create(data);
  }
}
