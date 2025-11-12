/**
 * Turing Machine - Domain Layer
 * Implements the execution rules and state transitions
 * Pure business logic with no external dependencies
 */

import { Tape } from "./tape.js";

/**
 * Transition rule for the Turing machine
 */
export interface Transition {
  currentState: string;
  readSymbol: string;
  writeSymbol: string;
  moveDirection: "L" | "R";
  nextState: string;
}

export class TuringMachine {
  private tape: Tape;
  private currentState: string;
  private transitions: Transition[];
  private initialState: string;
  private finalStates: Set<string>;

  /**
   * Creates a new Turing machine
   * @param tape - The tape to operate on
   * @param initialState - Starting state
   * @param transitions - Array of transition rules
   * @param finalStates - Array of final/halting states
   */
  constructor(
    tape: Tape,
    initialState: string,
    transitions: Transition[],
    finalStates: string[]
  ) {
    this.tape = tape;
    this.currentState = initialState;
    this.initialState = initialState;
    this.transitions = transitions;
    this.finalStates = new Set(finalStates);
  }

  /**
   * Gets the current state
   */
  getCurrentState(): string {
    return this.currentState;
  }

  /**
   * Gets the tape
   */
  getTape(): Tape {
    return this.tape;
  }

  /**
   * Checks if the machine is in a final state
   */
  isInFinalState(): boolean {
    return this.finalStates.has(this.currentState);
  }

  /**
   * Executes a single step of the machine
   * @returns true if step was executed, false if machine is halted
   */
  executeStep(): boolean {
    // Check if already in final state
    if (this.isInFinalState()) {
      return false;
    }

    // Read current symbol
    const readSymbol = this.tape.read();

    // Find matching transition
    const transition = this.transitions.find(
      (t) => t.currentState === this.currentState && t.readSymbol === readSymbol
    );

    if (!transition) {
      // No transition found - machine halts
      return false;
    }

    // Execute transition: write, move, change state
    this.tape.write(transition.writeSymbol);

    if (transition.moveDirection === "L") {
      this.tape.moveLeft();
    } else if (transition.moveDirection === "R") {
      this.tape.moveRight();
    }
    // If direction is neither L nor R, don't move (for "no move" behavior)

    this.currentState = transition.nextState;

    return true;
  }

  /**
   * Executes multiple steps until the machine halts or maxSteps is reached
   * @param maxSteps - Maximum number of steps to execute (default: 1000)
   * @returns number of steps actually executed
   */
  run(maxSteps: number = 1000): number {
    let stepsExecuted = 0;
    while (stepsExecuted < maxSteps && this.executeStep()) {
      stepsExecuted++;
    }
    return stepsExecuted;
  }

  /**
   * Resets the machine to initial state
   * @param initialContent - Initial tape content
   * @param headPosition - Initial head position
   */
  reset(initialContent: string, headPosition: number = 0): void {
    this.tape.reset(initialContent, headPosition);
    this.currentState = this.initialState;
  }

  /**
   * Gets all transitions
   */
  getTransitions(): Transition[] {
    return [...this.transitions]; // Return defensive copy
  }

  /**
   * Gets initial state
   */
  getInitialState(): string {
    return this.initialState;
  }

  /**
   * Gets final states
   */
  getFinalStates(): string[] {
    return Array.from(this.finalStates);
  }
}

