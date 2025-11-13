import {
  NewTuringMachineRecord,
  TuringMachineRecord,
} from "@/modules/index.schemas";
import { ITuringMachineRepository } from "../../infrastructure/interface";

export class CreateUseCase {
  constructor(private turingMachineRepository: ITuringMachineRepository) {}

  async execute(data: NewTuringMachineRecord): Promise<TuringMachineRecord> {
    return await this.turingMachineRepository.create(data);
  }
}
