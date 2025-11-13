import { TuringMachineRecord } from "@/modules/index.schemas";
import { ITuringMachineRepository } from "../../infrastructure/interface";

export class UpdateUseCase {
  constructor(private turingMachineRepository: ITuringMachineRepository) {}

  async execute(
    id: string,
    data: Partial<TuringMachineRecord>,
  ): Promise<TuringMachineRecord> {
    return await this.turingMachineRepository.update(id, data);
  }
}
