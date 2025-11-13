import { TuringMachineController } from "@/modules/turing-machine/application/controller";
import { CreateUseCase } from "@/modules/turing-machine/application/use-cases/create";
import { DeleteUseCase } from "@/modules/turing-machine/application/use-cases/delete";
import { TuringMachineRepository } from "@/modules/turing-machine/infrastructure/repositories/postgresql";
import { FastifyInstance } from "fastify";

export function routesPlugin(fastify: FastifyInstance, ops: any, done: any) {
  const repository = new TuringMachineRepository();

  const createUseCase = new CreateUseCase(repository);
  const deleteUseCase = new DeleteUseCase(repository);

  const createController = new TuringMachineController(
    createUseCase,
    deleteUseCase,
  );

  fastify.register(createController.registerRoutes, {
    prefix: "/tapes",
  });

  done();
}
