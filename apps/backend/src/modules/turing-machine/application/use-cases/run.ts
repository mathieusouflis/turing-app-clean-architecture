import { TuringMachineRecord } from "@/modules/index.schemas";
import { TapeDomain } from "../../domains/tape";
import { TuringMachineDomain } from "../../domains/turing-machine";
import { StepUseCase } from "./step";

export class RunUseCase {
  constructor(private stepUseCase: StepUseCase) {}

  async execute(id: string): Promise<TuringMachineRecord> {
    let isMachineHalted = true;
    let machine: TuringMachineRecord = await this.stepUseCase.execute(id);

    while (!isMachineHalted) {
      let tape = new TapeDomain(machine.tape);
      let turingMachine = new TuringMachineDomain(
        tape,
        machine.rules,
        machine.headPosition,
        machine.currentState,
      );
      isMachineHalted = turingMachine.isHalted();
      machine = await this.stepUseCase.execute(id);
    }

    return machine;
  }
}
