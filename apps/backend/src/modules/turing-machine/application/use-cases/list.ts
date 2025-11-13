import { TuringMachineRecord } from "@/modules/index.schemas";
import { ITuringMachineRepository } from "../../infrastructure/interface";

export class ListUseCase {
  constructor(private turingMachineRepository: ITuringMachineRepository) {}

  async execute(): Promise<TuringMachineRecord[]> {
    return await this.turingMachineRepository.getAll();
  }
}
