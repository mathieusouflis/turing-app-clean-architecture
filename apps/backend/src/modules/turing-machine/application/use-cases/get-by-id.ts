import { TuringMachineRecord } from "@/modules/index.schemas";
import { ITuringMachineRepository } from "../../infrastructure/interface";

export class GetByIdUseCase {
  constructor(private turingMachineRepository: ITuringMachineRepository) {}

  async execute(id: string): Promise<TuringMachineRecord> {
    return await this.turingMachineRepository.get(id);
  }
}
