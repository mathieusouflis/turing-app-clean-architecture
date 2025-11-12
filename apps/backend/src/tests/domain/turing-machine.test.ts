/**
 * Domain Layer Tests - Turing Machine
 * Tests the core Turing machine execution logic
 */

import { expect } from "chai";
import { describe, it } from "mocha";
import { TuringMachine } from "../../domain/turing-machine.js";
import { Tape } from "../../domain/tape.js";

describe("TuringMachine", () => {
  it("should execute a single step with matching transition", () => {
    const tape = new Tape("1", 0);
    const transitions = [
      {
        currentState: "A",
        readSymbol: "1",
        writeSymbol: "0",
        moveDirection: "R" as const,
        nextState: "B",
      },
    ];

    const machine = new TuringMachine(tape, "A", transitions, ["HALT"]);

    const executed = machine.executeStep();
    expect(executed).to.be.true;
    expect(machine.getCurrentState()).to.equal("B");
    expect(tape.read()).to.equal("_"); // Moved right, now reading blank
  });
});

