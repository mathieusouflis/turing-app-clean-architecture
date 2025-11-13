/**
 * Turing Machine - Domain Layer
 * Implements the execution rules and state transitions
 * Pure business logic with no external dependencies
 */

import { Tape } from "./tape.js";


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

  
  getCurrentState(): string {
    return this.currentState;
  }

  
  getTape(): Tape {
    return this.tape;
  }

  
  isInFinalState(): boolean {
    return this.finalStates.has(this.currentState);
  }

  
  executeStep(): boolean {
    
    if (this.isInFinalState()) {
      return false;
    }

    
    const readSymbol = this.tape.read();

    
    const transition = this.transitions.find(
      (t) => t.currentState === this.currentState && t.readSymbol === readSymbol
    );

    if (!transition) {
      
      return false;
    }

    
    this.tape.write(transition.writeSymbol);

    if (transition.moveDirection === "L") {
      this.tape.moveLeft();
    } else if (transition.moveDirection === "R") {
      this.tape.moveRight();
    }
    

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

  


  getTransitions(): Transition[] {
    return [...this.transitions]; 
  }

  
  getInitialState(): string {
    return this.initialState;
  }

  
  getFinalStates(): string[] {
    return Array.from(this.finalStates);
  }
}

