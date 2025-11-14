/**
 * Server Assembly
 * Wires together Fastify, database, use cases, and controllers
 */

import fastify, { type FastifyInstance } from "fastify";
import { createDatabaseClient, TapeRepository } from "./src/infrastructure/database/index.js";
import { CreateTapeUseCase } from "./src/application/controllers/use-cases/create-tape.js";
import { GetTapeUseCase } from "./src/application/controllers/use-cases/get-tape.js";
import { ExecuteStepUseCase } from "./src/application/controllers/use-cases/execute-steps.js";
import { RunMachineUseCase } from "./src/application/controllers/use-cases/run-machine.js";
import { ResetTapeUseCase } from "./src/application/controllers/use-cases/reset-tape.js";
import { DeleteTapeUseCase } from "./src/application/controllers/use-cases/delete-tape.js";
import { TapesController } from "./src/application/controllers/tape-controllers.js";

/**
 * Creates and configures the Fastify server
 * @param databaseUrl - PostgreSQL connection string
 * @returns Configured Fastify instance
 */
export async function createServer(databaseUrl: string): Promise<FastifyInstance> {
  // Create Fastify instance with logging
  const server = fastify({
    logger: true,
  });

  // Create database client
  const db = createDatabaseClient(databaseUrl);
  
  // Initialize repository
  const repository = new TapeRepository(db);
  
  // Note: Schema initialization should be done via migrations
  // Run `pnpm db:push` or `pnpm db:migrate` to create tables

  // Create use cases (inject repository dependency)
  const createTapeUseCase = new CreateTapeUseCase(repository);
  const getTapeUseCase = new GetTapeUseCase(repository);
  const executeStepUseCase = new ExecuteStepUseCase(repository);
  const runMachineUseCase = new RunMachineUseCase(repository);
  const resetTapeUseCase = new ResetTapeUseCase(repository);
  const deleteTapeUseCase = new DeleteTapeUseCase(repository);

  // Create controller (inject all use cases)
  const tapesController = new TapesController(
    createTapeUseCase,
    getTapeUseCase,
    executeStepUseCase,
    runMachineUseCase,
    resetTapeUseCase,
    deleteTapeUseCase
  );

  // Register routes
  tapesController.registerRoutes(server);

  // Health check route
  server.get("/ping", async () => {
    return "pong\n";
  });

  return server;
}
