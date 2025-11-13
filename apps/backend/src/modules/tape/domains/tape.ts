type TapeType = string;

export class TapeDomain {
  private tape: TapeType[];
  constructor(tape: TapeType) {
    this.tape = tape.split("");
  }

  public getTape(): TapeType[] {
    return this.tape;
  }

  public getFormattedTape(): TapeType {
    return this.tape.join(" ");
  }

  public getCell(position: number): string {
    if (position < 0 || position >= this.tape.length) {
      throw new Error("Invalid position");
    }
    return this.tape[position];
  }

  public write(position: number, value: string) {
    if (position < 0 || position >= this.tape.length) {
      throw new Error("Invalid position");
    }
    this.tape[position] = value;
  }
}
