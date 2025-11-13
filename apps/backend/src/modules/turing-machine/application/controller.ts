import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateUseCase } from "./use-cases/create";
import {
  NewTuringMachineRecordSchema,
  UpdateTuringMachineRecordSchema,
} from "../shemas/turing-machine";
import { DeleteUseCase } from "./use-cases/delete";
import { GetByIdUseCase } from "./use-cases/get-by-id";
import { ListUseCase } from "./use-cases/list";
import { UpdateUseCase } from "./use-cases/update";

export class TuringMachineController {
  constructor(
    private createUseCase: CreateUseCase,
    private deleteUseCase: DeleteUseCase,
    private getByIdUseCase: GetByIdUseCase,
    private listUseCase: ListUseCase,
    private updateUseCase: UpdateUseCase,
  ) {}

  public registerRoutes = (fastify: FastifyInstance, ops: any, done: any) => {
    fastify.post("/", this.create);
    fastify.get("/:id", this.getById);
    fastify.get("/", this.list);
    fastify.put("/:id/step", this.step);
    fastify.put("/:id/run", this.run);
    fastify.put("/:id", this.update);
    fastify.delete("/:id", this.delete);

    done();
  };

  private create = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body;
    const dataParsed = NewTuringMachineRecordSchema.safeParse(data);

    if (!dataParsed.success) {
      reply.status(400).send({ error: dataParsed.error.message });
      return;
    }

    const machine = await this.createUseCase.execute(dataParsed.data);

    reply.status(201).send(machine);
  };

  private getById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const machine = await this.getByIdUseCase.execute(id);

    reply.status(200).send(machine);
  };

  private list = async (request: FastifyRequest, reply: FastifyReply) => {
    const machines = await this.listUseCase.execute();

    reply.status(200).send(machines);
  };

  private step = async (request: FastifyRequest, reply: FastifyReply) => {};

  private run = async (request: FastifyRequest, reply: FastifyReply) => {};

  private update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const data = request.body;

    const dataParsed = UpdateTuringMachineRecordSchema.safeParse(data);

    if (!dataParsed.success) {
      reply.status(400).send({ error: dataParsed.error.message });
      return;
    }

    const machine = await this.updateUseCase.execute(id, dataParsed.data);

    reply.status(200).send(machine);
  };

  private delete = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    await this.deleteUseCase.execute(id);

    reply.status(204).send();
  };
}
