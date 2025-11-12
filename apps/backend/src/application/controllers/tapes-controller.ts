import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CreateTapeUseCase } from "../use-cases/create-tape.js";
import { GetTapeUseCase } from "../use-cases/get-tape.js";
import { ExecuteStepUseCase } from "../use-cases/execute-step.js";
import { RunMachineUseCase } from "../use-cases/run-machine.js";
import { ResetTapeUseCase } from "../use-cases/reset-tape.js";
import { DeleteTapeUseCase } from "../use-cases/delete-tape.js";
import { Transition } from "../../domain/turing-machine.js";

/**
 * Request body for creating a tape
 */
interface CreateTapeBody {
  content?: string;
  headPosition?: number;
  currentState?: string;
  transitions?: Transition[];
  initialState?: string;
  finalStates?: string[];
}

/**
 * Request body for running machine
 */
interface RunMachineBody {
  maxSteps?: number;
}

/**
 * Request body for resetting tape
 */
interface ResetTapeBody {
  content?: string;
  headPosition?: number;
}

/**
 * Application: Tapes Controller
 * Handles HTTP requests for tape operations
 */
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
   * Register all routes
   */
  registerRoutes(fastify: FastifyInstance): void {
    // POST /api/tapes - Create a new tape
    fastify.post<{ Body: CreateTapeBody }>(
      "/api/tapes",
      async (request: FastifyRequest<{ Body: CreateTapeBody }>, reply: FastifyReply) => {
        try {
          const result = await this.createTapeUseCase.execute({
            content: request.body.content,
            head_position: request.body.headPosition,
            current_state: request.body.currentState,
            transitions: request.body.transitions,
            initial_state: request.body.initialState,
            final_states: request.body.finalStates,
          });

          return reply.code(201).send(result);
        } catch (error) {
          return reply.code(500).send({
            error: "Failed to create tape",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    );

    // GET /api/tapes/:id - Get tape by ID
    fastify.get<{ Params: { id: string } }>(
      "/api/tapes/:id",
      async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
          const result = await this.getTapeUseCase.execute(request.params.id);

          if (!result) {
            return reply.code(404).send({
              error: "Tape not found",
            });
          }

          return reply.code(200).send(result);
        } catch (error) {
          return reply.code(500).send({
            error: "Failed to get tape",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    );

    // PUT /api/tapes/:id/step - Execute a single step
    fastify.put<{ Params: { id: string } }>(
      "/api/tapes/:id/step",
      async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
          const result = await this.executeStepUseCase.execute(request.params.id);
          return reply.code(200).send(result);
        } catch (error) {
          if (error instanceof Error && error.message.includes("not found")) {
            return reply.code(404).send({
              error: error.message,
            });
          }

          return reply.code(500).send({
            error: "Failed to execute step",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    );

    // PUT /api/tapes/:id/run - Execute multiple steps
    fastify.put<{ Params: { id: string }; Body: RunMachineBody }>(
      "/api/tapes/:id/run",
      async (
        request: FastifyRequest<{ Params: { id: string }; Body: RunMachineBody }>,
        reply: FastifyReply
      ) => {
        try {
          const result = await this.runMachineUseCase.execute(
            request.params.id,
            request.body.maxSteps || 1000
          );
          return reply.code(200).send(result);
        } catch (error) {
          if (error instanceof Error && error.message.includes("not found")) {
            return reply.code(404).send({
              error: error.message,
            });
          }

          return reply.code(500).send({
            error: "Failed to run machine",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    );

    // PUT /api/tapes/:id/reset - Reset tape (optional endpoint)
    fastify.put<{ Params: { id: string }; Body: ResetTapeBody }>(
      "/api/tapes/:id/reset",
      async (
        request: FastifyRequest<{ Params: { id: string }; Body: ResetTapeBody }>,
        reply: FastifyReply
      ) => {
        try {
          const result = await this.resetTapeUseCase.execute(
            request.params.id,
            request.body.content,
            request.body.headPosition
          );
          return reply.code(200).send(result);
        } catch (error) {
          if (error instanceof Error && error.message.includes("not found")) {
            return reply.code(404).send({
              error: error.message,
            });
          }

          return reply.code(500).send({
            error: "Failed to reset tape",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    );

    // DELETE /api/tapes/:id - Delete tape
    fastify.delete<{ Params: { id: string } }>(
      "/api/tapes/:id",
      async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
          const deleted = await this.deleteTapeUseCase.execute(request.params.id);

          if (!deleted) {
            return reply.code(404).send({
              error: "Tape not found",
            });
          }

          return reply.code(204).send();
        } catch (error) {
          return reply.code(500).send({
            error: "Failed to delete tape",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    );
  }
}

