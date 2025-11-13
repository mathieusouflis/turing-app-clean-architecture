import { dbConfig } from "@/config/db.config";
import { NewTapeRecord } from "../shemas/tape";
import { TapeRepository } from "./repositories/postgresql";

export class TapeInterface {
  private repository: InstanceType<typeof TapeRepository>;

  constructor() {
    this.repository = new TapeRepository(dbConfig);
  }

  async createTape(data: NewTapeRecord): Promise<any> {
    return await this.repository.create(data);
  }
}
