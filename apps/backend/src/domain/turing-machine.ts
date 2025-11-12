import { Tape } from "./tape.js";

/**
 * Transition rule for Turing machine
 */
export interface Transition {
  currentState: string;
  readSymbol: string;
  writeSymbol: string;
  moveDirection: "L" | "R";
  nextState: string;
}

/**
 * Domain: Turing Machine
 * Implements the rules and behavior of a Turing machine
 */
export class TuringMachine {
  private tape: Tape;
  private currentState: string;
  private transitions: Transition[];
  private initialState: string;
  private finalStates: Set<string>;

  constructor(
    tape: Tape,
    transitions: Transition[],
    initialState: string = "q0",
    finalStates: string[] = []
  ) {
    this.tape = tape;
    this.transitions = transitions;
    this.initialState = initialState;
    this.currentState = initialState;
    this.finalStates = new Set(finalStates);
  }

  /**
   * Execute a single step of the Turing machine
   * Returns true if a transition was executed, false if halted
   */
  executeStep(): { executed: boolean; halted: boolean; reason?: string } {
    // Check if in final state
    if (this.finalStates.has(this.currentState)) {
      return { executed: false, halted: true, reason: "Reached final state" };
    }

    const currentSymbol = this.tape.read();

    // Find matching transition
    const transition = this.transitions.find(
      (t) => t.currentState === this.currentState && t.readSymbol === currentSymbol
    );

    if (!transition) {
      return { executed: false, halted: true, reason: "No transition found" };
    }

    // Execute transition
    this.tape.write(transition.writeSymbol);

    // Special case: A + 1 → HALT with no movement (per subject requirements)
    if (transition.nextState === "HALT" && this.currentState === "A" && currentSymbol === "1") {
      // Don't move head when halting after reading "1" in state A
      this.currentState = transition.nextState;
    } else {
      // Normal movement
      if (transition.moveDirection === "L") {
        this.tape.moveLeft();
      } else {
        this.tape.moveRight();
      }
      this.currentState = transition.nextState;
    }

    return { executed: true, halted: false };
  }

  /**
   * Execute multiple steps until halt or max steps reached
   */
  executeSteps(maxSteps: number = 1000): {
    stepsExecuted: number;
    halted: boolean;
    reason?: string;
  } {
    let stepsExecuted = 0;

    while (stepsExecuted < maxSteps) {
      const result = this.executeStep();
      if (!result.executed) {
        return {
          stepsExecuted,
          halted: result.halted,
          reason: result.reason,
        };
      }
      stepsExecuted++;
    }

    return {
      stepsExecuted,
      halted: false,
      reason: "Maximum steps reached",
    };
  }

  /**
   * Get current state
   */
  getCurrentState(): string {
    return this.currentState;
  }

  /**
   * Set current state (used when restoring from database)
   */
  setCurrentState(state: string): void {
    this.currentState = state;
  }

  /**
   * Get tape
   */
  getTape(): Tape {
    return this.tape;
  }

  /**
   * Reset machine to initial state
   */
  reset(initialContent: string = "", headPosition: number = 0): void {
    this.tape.reset(initialContent, headPosition);
    this.currentState = this.initialState;
  }

  /**
   * Check if machine is in a final state
   */
  isInFinalState(): boolean {
    return this.finalStates.has(this.currentState);
  }
}

