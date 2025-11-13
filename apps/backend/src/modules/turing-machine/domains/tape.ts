type TapeType = string;

export class TapeDomain {
  private tape: string[];

  constructor(tape: TapeType) {
    this.tape = tape.split("");
  }

  public getTape(): string[] {
    return [...this.tape];
  }

  public getFormattedTape(): TapeType {
    return this.tape.join("");
  }

  public getCell(position: number): string {
    this.validatePosition(position);
    return this.tape[position];
  }

  public write(position: number, value: string): void {
    this.validatePosition(position);

    if (value.length !== 1) {
      throw new Error("Value must be a single character");
    }

    this.tape[position] = value;
  }

  public getLength(): number {
    return this.tape.length;
  }

  private validatePosition(position: number): void {
    if (!Number.isInteger(position)) {
      throw new Error("Position must be an integer");
    }

    if (position < 0 || position >= this.tape.length) {
      throw new Error(
        `Invalid position: ${position}. Valid range is 0-${this.tape.length - 1}`,
      );
    }
  }
}
