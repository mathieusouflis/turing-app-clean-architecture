/**
 * Tapes Controller
 * Handles HTTP requests for tape operations
 * Uses Fastify instead of Express
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { CreateTapeUseCase } from "../use-cases/create-tape.js";
import { GetTapeUseCase } from "../use-cases/get-tape.js";
import { ExecuteStepUseCase } from "../use-cases/execute-step.js";
import { RunMachineUseCase } from "../use-cases/run-machine.js";
import { ResetTapeUseCase } from "../use-cases/reset-tape.js";
import { DeleteTapeUseCase } from "../use-cases/delete-tape.js";
import {
  TapeNotFoundError,
  ValidationError,
  DatabaseError,
  TuringMachineError,
  MaxStepsExceededError,
} from "../../domain/errors.js";

interface TapeParams {
  id: string;
}

/**
 * Validation schemas using zod for runtime validation
 * Fastify JSON schemas handle request validation, zod handles business logic validation
 */
const uuidSchema = z.string().uuid("Invalid UUID format");

const runMachineBodySchema = z.object({
  maxSteps: z
    .number()
    .int("maxSteps must be an integer")
    .positive("maxSteps must be positive")
    .max(10000, "maxSteps cannot exceed 10000")
    .optional(),
});

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
    fastify.post("/api/tapes", {
      schema: {
        description: "Create a new tape",
        tags: ["tapes"],
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              content: { type: "string" },
              headPosition: { type: "number" },
              currentState: { type: "string" },
              transitions: { type: "object" },
              finalStates: { type: "array", items: { type: "string" } },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    }, this.create.bind(this));

    // GET /api/tapes/:id - Get tape by ID
    fastify.get("/api/tapes/:id", {
      schema: {
        description: "Get tape by ID",
        tags: ["tapes"],
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
            },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              content: { type: "string" },
              headPosition: { type: "number" },
              currentState: { type: "string" },
              transitions: { type: "object" },
              finalStates: { type: "array", items: { type: "string" } },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    }, this.getById.bind(this));

    // PUT /api/tapes/:id/step - Execute a single step
    fastify.put("/api/tapes/:id/step", {
      schema: {
        description: "Execute a single step",
        tags: ["tapes"],
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
            },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              content: { type: "string" },
              headPosition: { type: "number" },
              currentState: { type: "string" },
              transitions: { type: "object" },
              finalStates: { type: "array", items: { type: "string" } },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    }, this.executeStep.bind(this));

    // PUT /api/tapes/:id/run - Execute multiple steps
    fastify.put("/api/tapes/:id/run", {
      schema: {
        description: "Execute multiple steps",
        tags: ["tapes"],
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
            },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            maxSteps: {
              type: "integer",
              minimum: 1,
              maximum: 10000,
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              tape: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  content: { type: "string" },
                  headPosition: { type: "number" },
                  currentState: { type: "string" },
                  transitions: { type: "object" },
                  finalStates: { type: "array", items: { type: "string" } },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" },
                },
              },
              stepsExecuted: { type: "number" },
            },
          },
        },
      },
    }, this.run.bind(this));

    // PUT /api/tapes/:id/reset - Reset tape to initial state
    fastify.put("/api/tapes/:id/reset", {
      schema: {
        description: "Reset tape to initial state",
        tags: ["tapes"],
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
            },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              content: { type: "string" },
              headPosition: { type: "number" },
              currentState: { type: "string" },
              transitions: { type: "object" },
              finalStates: { type: "array", items: { type: "string" } },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    }, this.reset.bind(this));

    // DELETE /api/tapes/:id - Delete tape
    fastify.delete("/api/tapes/:id", {
      schema: {
        description: "Delete tape",
        tags: ["tapes"],
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
            },
          },
          required: ["id"],
        },
      },
    }, this.delete.bind(this));
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
      this.handleError(error, reply, "Failed to create tape");
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

      // Validate UUID format
      const validationResult = uuidSchema.safeParse(id);
      if (!validationResult.success) {
        throw new ValidationError("Invalid tape ID format", {
          tapeId: id,
          errors: validationResult.error.errors,
        });
      }

      const tape = await this.getTapeUseCase.execute(id);

      if (!tape) {
        throw new TapeNotFoundError(id);
      }

      reply.code(200).send(tape);
    } catch (error) {
      this.handleError(error, reply, "Failed to get tape", request.params.id);
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

      // Validate UUID format
      const validationResult = uuidSchema.safeParse(id);
      if (!validationResult.success) {
        throw new ValidationError("Invalid tape ID format", {
          tapeId: id,
          errors: validationResult.error.errors,
        });
      }

      const tape = await this.executeStepUseCase.execute(id);

      if (!tape) {
        throw new TapeNotFoundError(id);
      }

      reply.code(200).send(tape);
    } catch (error) {
      this.handleError(error, reply, "Failed to execute step", request.params.id);
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

      // Validate UUID format
      const idValidation = uuidSchema.safeParse(id);
      if (!idValidation.success) {
        throw new ValidationError("Invalid tape ID format", {
          tapeId: id,
          errors: idValidation.error.errors,
        });
      }

      // Validate request body
      const bodyValidation = runMachineBodySchema.safeParse(body);
      if (!bodyValidation.success) {
        throw new ValidationError("Invalid request body", {
          tapeId: id,
          errors: bodyValidation.error.errors,
        });
      }

      const result = await this.runMachineUseCase.execute(id, bodyValidation.data);

      if (!result) {
        throw new TapeNotFoundError(id);
      }

      reply.code(200).send(result);
    } catch (error) {
      this.handleError(error, reply, "Failed to run machine", request.params.id);
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

      // Validate UUID format
      const validationResult = uuidSchema.safeParse(id);
      if (!validationResult.success) {
        throw new ValidationError("Invalid tape ID format", {
          tapeId: id,
          errors: validationResult.error.errors,
        });
      }

      const tape = await this.resetTapeUseCase.execute(id);

      if (!tape) {
        throw new TapeNotFoundError(id);
      }

      reply.code(200).send(tape);
    } catch (error) {
      this.handleError(error, reply, "Failed to reset tape", request.params.id);
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

      // Validate UUID format
      const validationResult = uuidSchema.safeParse(id);
      if (!validationResult.success) {
        throw new ValidationError("Invalid tape ID format", {
          tapeId: id,
          errors: validationResult.error.errors,
        });
      }

      const deleted = await this.deleteTapeUseCase.execute(id);

      if (!deleted) {
        throw new TapeNotFoundError(id);
      }

      reply.code(204).send();
    } catch (error) {
      this.handleError(error, reply, "Failed to delete tape", request.params.id);
    }
  }

  /**
   * Centralized error handler
   * Maps domain errors to appropriate HTTP responses with context
   */
  private handleError(
    error: unknown,
    reply: FastifyReply,
    defaultMessage: string,
    tapeId?: string
  ): void {
    // Handle domain errors
    if (error instanceof TapeNotFoundError) {
      reply.code(error.statusCode).send(error.toJSON());
      return;
    }

    if (error instanceof ValidationError) {
      reply.code(error.statusCode).send(error.toJSON());
      return;
    }

    if (error instanceof DatabaseError) {
      reply.code(error.statusCode).send(error.toJSON());
      return;
    }

    if (error instanceof TuringMachineError) {
      reply.code(error.statusCode).send(error.toJSON());
      return;
    }

    if (error instanceof MaxStepsExceededError) {
      reply.code(error.statusCode).send(error.toJSON());
      return;
    }

    // Handle unknown errors
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    const errorContext: Record<string, unknown> = {
      message: errorMessage,
    };

    if (tapeId) {
      errorContext.tapeId = tapeId;
    }

    if (error instanceof Error && error.stack) {
      errorContext.stack = error.stack;
    }

    reply.code(500).send({
      error: "InternalServerError",
      code: "INTERNAL_SERVER_ERROR",
      message: defaultMessage,
      context: errorContext,
    });
  }
}

