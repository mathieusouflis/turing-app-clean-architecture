/**
 * Domain Layer Tests - Tape Entity
 * Tests the core Tape behavior (read, write, move)
 */

import { expect } from "chai";
import { describe, it } from "mocha";
import { Tape } from "../../domain/tape.js";

describe("Tape", () => {
  it("should create a tape with initial content", () => {
    const tape = new Tape("ABC", 0);
    expect(tape.getContent()).to.equal("ABC");
    expect(tape.getHeadPosition()).to.equal(0);
  });

  it("should read symbol at head position", () => {
    const tape = new Tape("ABC", 0);
    expect(tape.read()).to.equal("A");
    
    tape.moveRight();
    expect(tape.read()).to.equal("B");
  });

  it("should write symbol at head position", () => {
    const tape = new Tape("ABC", 1);
    tape.write("X");
    expect(tape.getContent()).to.equal("AXC");
  });
});

