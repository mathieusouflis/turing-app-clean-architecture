/**
 * Tapes Controller
 * Handles HTTP requests for tape operations
 * Uses Fastify instead of Express
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CreateTapeUseCase } from "../use-cases/create-tape.js";
import { GetTapeUseCase } from "../use-cases/get-tape.js";
import { ExecuteStepUseCase } from "../use-cases/execute-step.js";
import { RunMachineUseCase } from "../use-cases/run-machine.js";
import { ResetTapeUseCase } from "../use-cases/reset-tape.js";
import { DeleteTapeUseCase } from "../use-cases/delete-tape.js";

interface TapeParams {
  id: string;
}

interface RunMachineBody {
  maxSteps?: number;
}

export class TapesController {
  constructor(
    private createTapeUseCase: CreateTapeUseCase,
    private getTapeUseCase: GetTapeUseCase,
    private executeStepUseCase: ExecuteStepUseCase,
    private runMachineUseCase: RunMachineUseCase,
    private resetTapeUseCase: ResetTapeUseCase,
    private deleteTapeUseCase: DeleteTapeUseCase
  ) {}

  /**
   * Registers all tape routes with Fastify
   * @param fastify - Fastify instance
   */
  registerRoutes(fastify: FastifyInstance): void {
    // POST /api/tapes - Create a new tape
    fastify.post("/api/tapes", this.create.bind(this));

    // GET /api/tapes/:id - Get tape by ID
    fastify.get("/api/tapes/:id", this.getById.bind(this));

    // PUT /api/tapes/:id/step - Execute a single step
    fastify.put("/api/tapes/:id/step", this.executeStep.bind(this));

    // PUT /api/tapes/:id/run - Execute multiple steps
    fastify.put("/api/tapes/:id/run", this.run.bind(this));

    // PUT /api/tapes/:id/reset - Reset tape to initial state
    fastify.put("/api/tapes/:id/reset", this.reset.bind(this));

    // DELETE /api/tapes/:id - Delete tape
    fastify.delete("/api/tapes/:id", this.delete.bind(this));
  }

  /**
   * POST /api/tapes - Create a new tape
   */
  private async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const result = await this.createTapeUseCase.execute();
      reply.code(201).send(result);
    } catch (error) {
      reply.code(500).send({ error: "Failed to create tape" });
    }
  }

  /**
   * GET /api/tapes/:id - Get tape by ID
   */
  private async getById(
    request: FastifyRequest<{ Params: TapeParams }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;
      const tape = await this.getTapeUseCase.execute(id);

      if (!tape) {
        reply.code(404).send({ error: "Tape not found" });
        return;
      }

      reply.code(200).send(tape);
    } catch (error) {
      reply.code(500).send({ error: "Failed to get tape" });
    }
  }

  /**
   * PUT /api/tapes/:id/step - Execute a single step
   */
  private async executeStep(
    request: FastifyRequest<{ Params: TapeParams }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;
      const tape = await this.executeStepUseCase.execute(id);

      if (!tape) {
        reply.code(404).send({ error: "Tape not found" });
        return;
      }

      reply.code(200).send(tape);
    } catch (error) {
      reply.code(500).send({ error: "Failed to execute step" });
    }
  }

  /**
   * PUT /api/tapes/:id/run - Execute multiple steps
   */
  private async run(
    request: FastifyRequest<{ Params: TapeParams; Body: RunMachineBody }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;
      const body = request.body || {};
      const result = await this.runMachineUseCase.execute(id, body);

      if (!result) {
        reply.code(404).send({ error: "Tape not found" });
        return;
      }

      reply.code(200).send(result);
    } catch (error) {
      reply.code(500).send({ error: "Failed to run machine" });
    }
  }

  /**
   * PUT /api/tapes/:id/reset - Reset tape to initial state
   */
  private async reset(
    request: FastifyRequest<{ Params: TapeParams }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;
      const tape = await this.resetTapeUseCase.execute(id);

      if (!tape) {
        reply.code(404).send({ error: "Tape not found" });
        return;
      }

      reply.code(200).send(tape);
    } catch (error) {
      reply.code(500).send({ error: "Failed to reset tape" });
    }
  }

  /**
   * DELETE /api/tapes/:id - Delete tape
   */
  private async delete(
    request: FastifyRequest<{ Params: TapeParams }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;
      const deleted = await this.deleteTapeUseCase.execute(id);

      if (!deleted) {
        reply.code(404).send({ error: "Tape not found" });
        return;
      }

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({ error: "Failed to delete tape" });
    }
  }
}

