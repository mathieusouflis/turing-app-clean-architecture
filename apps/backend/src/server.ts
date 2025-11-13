/**
 * Server Assembly
 * Wires together Fastify, database, use cases, and controllers
 */

import fastify, { type FastifyInstance } from "fastify";
import { sql } from "drizzle-orm";
import { createDatabaseClient, TapeRepository } from "./infrastructure/database/index.js";
import { CreateTapeUseCase } from "./application/use-cases/create-tape.js";
import { GetTapeUseCase } from "./application/use-cases/get-tape.js";
import { ExecuteStepUseCase } from "./application/use-cases/execute-step.js";
import { RunMachineUseCase } from "./application/use-cases/run-machine.js";
import { ResetTapeUseCase } from "./application/use-cases/reset-tape.js";
import { DeleteTapeUseCase } from "./application/use-cases/delete-tape.js";
import { TapesController } from "./application/controllers/tapes-controller.js";

/**
 * Creates and configures the Fastify server
 * @param databaseUrl - PostgreSQL connection string
 * @returns Configured Fastify instance
 */
export async function createServer(databaseUrl: string): Promise<FastifyInstance> {
  const server = fastify({
    logger: true,
  });

  const db = createDatabaseClient(databaseUrl);
  
  const repository = new TapeRepository(db);
  
  // Run `pnpm db:push` or `pnpm db:migrate` to create tables

  const createTapeUseCase = new CreateTapeUseCase(repository);
  const getTapeUseCase = new GetTapeUseCase(repository);
  const executeStepUseCase = new ExecuteStepUseCase(repository);
  const runMachineUseCase = new RunMachineUseCase(repository);
  const resetTapeUseCase = new ResetTapeUseCase(repository);
  const deleteTapeUseCase = new DeleteTapeUseCase(repository);

  const tapesController = new TapesController(
    createTapeUseCase,
    getTapeUseCase,
    executeStepUseCase,
    runMachineUseCase,
    resetTapeUseCase,
    deleteTapeUseCase
  );

  tapesController.registerRoutes(server);

  server.get("/health", {
    schema: {
      description: "Health check endpoint",
      tags: ["health"],
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
            database: {
              type: "object",
              properties: {
                status: { type: "string" },
                responseTime: { type: "number" },
              },
            },
          },
        },
        503: {
          type: "object",
          properties: {
            status: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
            database: {
              type: "object",
              properties: {
                status: { type: "string" },
                error: { type: "string" },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const startTime = Date.now();

    try {
      await db.execute(sql`SELECT 1`);
      const responseTime = Date.now() - startTime;

      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: {
          status: "connected",
          responseTime,
        },
      };
    } catch (error) {
      const dbError = error instanceof Error ? error.message : "Unknown database error";

      reply.code(503);
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: {
          status: "disconnected",
          error: dbError,
        },
      };
    }
  });

  server.get("/ping", {
    schema: {
      description: "Simple ping endpoint",
      tags: ["health"],
      response: {
        200: {
          type: "string",
        },
      },
    },
  }, async () => {
    return "pong\n";
  });

  return server;
}

