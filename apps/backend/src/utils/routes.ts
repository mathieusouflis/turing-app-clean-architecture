import { TuringMachineController } from "@/modules/turing-machine/application/controller";
import { CreateUseCase } from "@/modules/turing-machine/application/use-cases/create";
import { DeleteUseCase } from "@/modules/turing-machine/application/use-cases/delete";
import { GetByIdUseCase } from "@/modules/turing-machine/application/use-cases/get-by-id";
import { ListUseCase } from "@/modules/turing-machine/application/use-cases/list";
import { RunUseCase } from "@/modules/turing-machine/application/use-cases/run";
import { StepUseCase } from "@/modules/turing-machine/application/use-cases/step";
import { UpdateUseCase } from "@/modules/turing-machine/application/use-cases/update";
import { TuringMachineRepository } from "@/modules/turing-machine/infrastructure/repositories/postgresql";
import { FastifyInstance } from "fastify";

export function routesPlugin(fastify: FastifyInstance, ops: any, done: any) {
  const repository = new TuringMachineRepository();

  const createUseCase = new CreateUseCase(repository);
  const deleteUseCase = new DeleteUseCase(repository);
  const getByIdUseCase = new GetByIdUseCase(repository);
  const listUseCase = new ListUseCase(repository);
  const stepUseCase = new StepUseCase(repository);
  const runUseCase = new RunUseCase(stepUseCase);
  const updateUseCase = new UpdateUseCase(repository);

  const createController = new TuringMachineController(
    createUseCase,
    deleteUseCase,
    getByIdUseCase,
    listUseCase,
    stepUseCase,
    runUseCase,
    updateUseCase,
  );

  fastify.register(createController.registerRoutes, {
    prefix: "/tapes",
  });

  done();
}
