import { TapeDomain } from "./tape";

type TapeType = InstanceType<typeof TapeDomain>;

type TuringRules<T extends string[]> = {
  state: T[number];
  output: string;
  direction: "left" | "right" | "stop";
  nextState: T[number];
}[];

export class TuringMachineDomain<T extends string[]> {
  private tape: TapeType;
  private head: number;
  private state: string;
  private rules: TuringRules<T>;

  constructor(tape: TapeType, rules: TuringRules<T>) {
    this.tape = tape;
    this.rules = rules;
    this.head = 0;
    this.state = rules[0].state;
  }

  public step() {
    this.write();
    this.move();
  }

  private getCurrentRule(): TuringRules<T>[number] | undefined {
    const rule = this.rules.find(
      (rule) =>
        rule.state === this.state &&
        rule.output === this.tape.getCell(this.head),
    );

    if (!rule) return undefined;
    return rule;
  }

  private write() {
    const rule = this.getCurrentRule();
    if (!rule) return;
    this.tape.write(this.head, rule.output);
  }

  private move() {
    const rule = this.getCurrentRule();
    if (!rule) return;
    switch (rule.direction) {
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
