import { TuringMachineRecord } from "@/modules/index.schemas";
import { ITuringMachineRepository } from "../../infrastructure/interface";
import { TapeDomain } from "../../domains/tape";
import { TuringMachineDomain } from "../../domains/turing-machine";

export class StepUseCase {
  constructor(private turingMachineRepository: ITuringMachineRepository) {}

  async execute(id: string): Promise<TuringMachineRecord> {
    const machine = await this.turingMachineRepository.get(id);

    const tape = new TapeDomain(machine.tape);
    const turingMachine = new TuringMachineDomain(
      tape,
      machine.rules,
      machine.headPosition,
      machine.currentState,
    );

    turingMachine.step();

    const turingMachineStatus = turingMachine.getMachineState();

    const updatedMachine = await this.turingMachineRepository.update(id, {
      tape: turingMachineStatus.tape,
      headPosition: turingMachineStatus.head,
      currentState: turingMachineStatus.state,
      transitions: [
        {
          currentState: machine.currentState,
          readSymbol: turingMachineStatus.readSymbol,
          writeSymbol: turingMachineStatus.writeSymbol,
          moveDirection: turingMachineStatus.moveDirection,
          nextState: turingMachineStatus.state,
        },
        ...machine.transitions,
      ],
    });

    return updatedMachine;
  }
}
