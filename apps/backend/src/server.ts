import fastify, { FastifyInstance } from "fastify";
import postgres from "@fastify/postgres";
import { TapeRepository } from "./infrastructure/database/repository.js";
import { CreateTapeUseCase } from "./application/use-cases/create-tape.js";
import { GetTapeUseCase } from "./application/use-cases/get-tape.js";
import { ExecuteStepUseCase } from "./application/use-cases/execute-step.js";
import { RunMachineUseCase } from "./application/use-cases/run-machine.js";
import { ResetTapeUseCase } from "./application/use-cases/reset-tape.js";
import { DeleteTapeUseCase } from "./application/use-cases/delete-tape.js";
import { TapesController } from "./application/controllers/tapes-controller.js";

/**
 * Server setup and initialization
 * Assembles Fastify, connects to PostgreSQL, and mounts routes
 */
export async function createServer(): Promise<FastifyInstance> {
  const server = fastify({
    logger: true,
  });

  // Register PostgreSQL plugin
  // Connection string from environment variable or default
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/turing_machine";

  await server.register(postgres, {
    connectionString,
  });

  // Initialize database schema
  const repository = new TapeRepository(server.pg);
  await repository.initialize();

  // Initialize use cases
  const createTapeUseCase = new CreateTapeUseCase(repository);
  const getTapeUseCase = new GetTapeUseCase(repository);
  const executeStepUseCase = new ExecuteStepUseCase(repository);
  const runMachineUseCase = new RunMachineUseCase(repository);
  const resetTapeUseCase = new ResetTapeUseCase(repository);
  const deleteTapeUseCase = new DeleteTapeUseCase(repository);

  // Initialize controller and register routes
  const tapesController = new TapesController(
    createTapeUseCase,
    getTapeUseCase,
    executeStepUseCase,
    runMachineUseCase,
    resetTapeUseCase,
    deleteTapeUseCase
  );

  tapesController.registerRoutes(server);

  // Health check endpoint
  server.get("/ping", async () => {
    return "pong\n";
  });

  return server;
}

