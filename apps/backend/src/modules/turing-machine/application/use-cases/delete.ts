import { ITuringMachineRepository } from "../../infrastructure/interface";

export class DeleteUseCase {
  constructor(private turingMachineRepository: ITuringMachineRepository) {}

  async execute(id: string) {
    await this.turingMachineRepository.delete(id);
  }
}
