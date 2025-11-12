/**
 * Application Layer Tests - CreateTapeUseCase
 * Tests the use case for creating a new tape
 */

import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";
import { createSandbox, type SinonSandbox } from "sinon";
import { CreateTapeUseCase } from "../../application/use-cases/create-tape.js";
import { TapeRepository } from "../../infrastructure/database/repository.js";
import type { TapeRecord } from "../../infrastructure/database/schema.js";

describe("CreateTapeUseCase", () => {
  let sandbox: SinonSandbox;
  let mockRepository: any;
  let useCase: CreateTapeUseCase;

  beforeEach(() => {
    sandbox = createSandbox();
    mockRepository = {
      create: sandbox.stub(),
    };
    useCase = new CreateTapeUseCase(mockRepository as unknown as TapeRepository);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create a new tape with default unary machine configuration", async () => {
    const createdRecord: TapeRecord = {
      id: "test-id",
      content: "______1",
      initialContent: "______1",
      headPosition: 0,
      currentState: "A",
      transitions: [],
      initialState: "A",
      finalStates: ["HALT"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository.create.resolves(createdRecord);

    const result = await useCase.execute();

    expect(result.id).to.equal("test-id");
    expect(mockRepository.create.calledOnce).to.be.true;
  });
});

