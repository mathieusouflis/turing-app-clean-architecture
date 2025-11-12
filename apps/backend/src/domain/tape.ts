/**
 * Domain entity: Tape
 * Represents the tape of a Turing machine with its current state
 */
export class Tape {
  private cells: string[];
  private headPosition: number;

  constructor(initialContent: string = "", headPosition: number = 0) {
    // Initialize tape with content, padding with blanks if needed
    this.cells = initialContent.split("");
    this.headPosition = headPosition;

    // Ensure head position is valid
    if (this.headPosition < 0) {
      this.headPosition = 0;
    }
    if (this.headPosition >= this.cells.length) {
      // Pad with blanks if head is beyond current content
      this.cells = [...this.cells, ...Array(this.headPosition - this.cells.length + 1).fill(" ")];
    }
  }

  /**
   * Get current symbol under the head
   */
  read(): string {
    if (this.headPosition < 0 || this.headPosition >= this.cells.length) {
      return " "; // Blank symbol
    }
    return this.cells[this.headPosition] || " ";
  }

  /**
   * Write a symbol at the current head position
   */
  write(symbol: string): void {
    if (this.headPosition < 0) {
      throw new Error("Head position cannot be negative");
    }

    // Expand tape if necessary
    while (this.headPosition >= this.cells.length) {
      this.cells.push(" ");
    }

    this.cells[this.headPosition] = symbol;
  }

  /**
   * Move head left
   */
  moveLeft(): void {
    this.headPosition--;
    if (this.headPosition < 0) {
      this.headPosition = 0; // Prevent negative positions
    }
  }

  /**
   * Move head right
   */
  moveRight(): void {
    this.headPosition++;
    // Tape expands automatically when writing
  }

  /**
   * Get current head position
   */
  getHeadPosition(): number {
    return this.headPosition;
  }

  /**
   * Get tape content as string
   */
  getContent(): string {
    return this.cells.join("");
  }

  /**
   * Get all cells as array
   */
  getCells(): string[] {
    return [...this.cells]; // Return copy to prevent mutation
  }

  /**
   * Reset tape to initial state
   */
  reset(initialContent: string = "", headPosition: number = 0): void {
    this.cells = initialContent.split("");
    this.headPosition = headPosition;

    if (this.headPosition < 0) {
      this.headPosition = 0;
    }
    if (this.headPosition >= this.cells.length) {
      this.cells = [...this.cells, ...Array(this.headPosition - this.cells.length + 1).fill(" ")];
    }
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): { content: string; headPosition: number } {
    return {
      content: this.getContent(),
      headPosition: this.headPosition,
    };
  }
}

