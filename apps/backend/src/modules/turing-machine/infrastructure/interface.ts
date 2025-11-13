import {
  NewTuringMachineRecord,
  TuringMachineRecord,
} from "../shemas/turing-machine";

export interface ITuringMachineRepository {
  create(data: NewTuringMachineRecord): Promise<TuringMachineRecord>;
  get(id: string): Promise<TuringMachineRecord>;
  getAll(): Promise<TuringMachineRecord[]>;
  update(
    id: string,
    data: Partial<TuringMachineRecord>,
  ): Promise<TuringMachineRecord>;
  delete(id: string): Promise<void>;
}
