import { TapeDomain } from "./tape";

type TapeType = InstanceType<typeof TapeDomain>;

type Direction = "left" | "right" | "stop";

type TuringRules<T extends string[]> = {
  state: T[number];
  input: string;
  output: string;
  direction: Direction;
  nextState: T[number];
}[];

export class TuringMachineDomain<T extends string[]> {
  private tape: TapeType;
  private head: number;
  private state: string;
  private rules: TuringRules<T>;
  private readSymbol: string;
  private writeSymbol: string;
  private moveDirection: Direction;

  constructor(
    tape: TapeType,
    rules: TuringRules<T>,
    head: number = 0,
    state?: string,
  ) {
    this.tape = tape;
    this.rules = rules;
    this.head = head;
    this.state = state ?? rules[0].state;
    this.readSymbol = "";
    this.writeSymbol = "";
    this.moveDirection = "stop";
  }

  public step() {
    const rule = this.getCurrentRule();
    if (!rule) return;

    this.readSymbol = rule.input;
    this.writeSymbol = rule.output;
    this.moveDirection = rule.direction;
    this.tape.write(this.head, rule.output);
    this.state = rule.nextState;
    this.moveHead(rule.direction);
  }

  public isHalted(): boolean {
    return this.state === "stop";
  }

  public getMachineState() {
    return {
      tape: this.tape.getFormattedTape(),
      head: this.head,
      readSymbol: this.readSymbol,
      writeSymbol: this.writeSymbol,
      moveDirection: this.moveDirection,
      state: this.state,
    };
  }

  private getCurrentRule(): TuringRules<T>[number] | undefined {
    return this.rules.find(
      (rule) =>
        rule.state === this.state &&
        rule.input === this.tape.getCell(this.head),
    );
  }

  private moveHead(direction: Direction) {
    switch (direction) {
      case "left":
        this.head -= 1;
        break;
      case "right":
        this.head += 1;
        break;
      case "stop":
        break;
    }
  }
}
