import {
  NewTuringMachineRecord,
  TuringMachineRecord,
} from "@/modules/index.schemas";
import { TuringMachineInterface } from "../../infrastructure/interface";

export class CreateTuringMachineUseCase {
  private interface: InstanceType<typeof TuringMachineInterface>;

  constructor(_interface: InstanceType<typeof TuringMachineInterface>) {
    this.interface = _interface;
  }

  async execute(data: NewTuringMachineRecord): Promise<TuringMachineRecord> {
    return await this.interface.create(data);
  }
}
