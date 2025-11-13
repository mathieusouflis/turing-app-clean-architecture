import { dbConfig } from "@/config/db.config";
import { TuringMachineRepository } from "./repositories/postgresql";
import {
  NewTuringMachineRecord,
  TuringMachineRecord,
} from "../shemas/turing-machine";

export class TuringMachineInterface {
  private repository: InstanceType<typeof TuringMachineRepository>;

  constructor() {
    this.repository = new TuringMachineRepository(dbConfig);
  }

  async create(data: NewTuringMachineRecord): Promise<TuringMachineRecord> {
    return await this.repository.create(data);
  }
}
