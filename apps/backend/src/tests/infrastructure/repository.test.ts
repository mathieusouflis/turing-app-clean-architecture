/**
 * Infrastructure Layer Tests - TapeRepository
 * Tests CRUD operations using mocked database
 */

import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import { createSandbox, type SinonSandbox } from "sinon";
import { TapeRepository } from "../../infrastructure/database/repository.js";
import type { DatabaseClient } from "../../infrastructure/database/client.js";
import type { TapeRecord, NewTapeRecord } from "../../infrastructure/database/schema.js";

describe("TapeRepository", () => {
  let sandbox: SinonSandbox;
  let mockDb: any;
  let repository: TapeRepository;

  beforeEach(() => {
    sandbox = createSandbox();
    // Mock database client with chainable methods
    mockDb = {
      insert: sandbox.stub().returnsThis(),
      values: sandbox.stub().returnsThis(),
      returning: sandbox.stub(),
      select: sandbox.stub().returnsThis(),
      from: sandbox.stub().returnsThis(),
      where: sandbox.stub().returnsThis(),
      limit: sandbox.stub(),
      update: sandbox.stub().returnsThis(),
      set: sandbox.stub().returnsThis(),
      delete: sandbox.stub().returnsThis(),
    };
    repository = new TapeRepository(mockDb as unknown as DatabaseClient);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create a new tape record", async () => {
    const newTape: NewTapeRecord = {
      content: "ABC",
      initialContent: "ABC",
      headPosition: 0,
      currentState: "A",
      transitions: [],
      initialState: "A",
      finalStates: ["HALT"],
    };

    const createdRecord: TapeRecord = {
      ...newTape,
      id: "test-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDb.returning.resolves([createdRecord]);

    const result = await repository.create(newTape);

    expect(result).to.deep.equal(createdRecord);
    expect(mockDb.insert.calledOnce).to.be.true;
    expect(mockDb.values.calledWith(newTape)).to.be.true;
  });
});

