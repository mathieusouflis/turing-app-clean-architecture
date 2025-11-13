/**
 * Tape Entity - Domain Layer
 * Represents the infinite tape of a Turing machine
 * Pure business logic with no external dependencies
 */

export class Tape {
  private cells: string[];
  private headPosition: number;

  /**
   * Creates a new tape
   * @param initialContent - Initial tape content as string (e.g., "______1")
   * @param headPosition - Initial head position (default: 0)
   */
  constructor(initialContent: string = "", headPosition: number = 0) {
    this.cells = initialContent.split("");
    this.headPosition = Math.max(0, headPosition);
  }

  
  read(): string {
    if (this.headPosition < 0 || this.headPosition >= this.cells.length) {
      return "_";
    }
    return this.cells[this.headPosition] || "_";
  }

  
  write(symbol: string): void {
    while (this.headPosition >= this.cells.length) {
      this.cells.push("_");
    }
    this.cells[this.headPosition] = symbol;
  }

  
  moveLeft(): void {
    if (this.headPosition > 0) {
      this.headPosition--;
    }
  }

  
  moveRight(): void {
    this.headPosition++;
  }

  
  getHeadPosition(): number {
    return this.headPosition;
  }


  getContent(): string {
    return this.cells.join("");
  }

  
  getCells(): string[] {
    return [...this.cells]; 
  }

  /**
   * Resets the tape to initial state
   * @param initialContent - Content to reset to
   * @param headPosition - Head position to reset to
   */
  reset(initialContent: string, headPosition: number = 0): void {
    this.cells = initialContent.split("");
    this.headPosition = Math.max(0, headPosition);
  }

  
  clone(): Tape {
    const cloned = new Tape(this.getContent(), this.headPosition);
    return cloned;
  }
}

