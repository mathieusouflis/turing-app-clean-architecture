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

  /**
   * Reads the symbol at the current head position
   * Returns blank "_" if position is out of bounds
   */
  read(): string {
    if (this.headPosition < 0 || this.headPosition >= this.cells.length) {
      return "_";
    }
    return this.cells[this.headPosition] || "_";
  }

  /**
   * Writes a symbol at the current head position
   * Expands the tape if necessary
   */
  write(symbol: string): void {
    // Expand tape if head is beyond current bounds
    while (this.headPosition >= this.cells.length) {
      this.cells.push("_");
    }
    this.cells[this.headPosition] = symbol;
  }

  /**
   * Moves the head left (decrements position)
   * Prevents negative positions
   */
  moveLeft(): void {
    if (this.headPosition > 0) {
      this.headPosition--;
    }
  }

  /**
   * Moves the head right (increments position)
   */
  moveRight(): void {
    this.headPosition++;
  }

  /**
   * Gets the current head position
   */
  getHeadPosition(): number {
    return this.headPosition;
  }

  /**
   * Gets the tape content as a string
   */
  getContent(): string {
    return this.cells.join("");
  }

  /**
   * Gets the tape content as an array
   */
  getCells(): string[] {
    return [...this.cells]; // Return defensive copy
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

  /**
   * Creates a copy of the tape (for immutability patterns)
   */
  clone(): Tape {
    const cloned = new Tape(this.getContent(), this.headPosition);
    return cloned;
  }
}

