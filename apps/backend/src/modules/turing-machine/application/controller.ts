import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateUseCase } from "./use-cases/create";
import { NewTuringMachineRecordSchema } from "../shemas/turing-machine";
import { DeleteUseCase } from "./use-cases/delete";

export class TuringMachineController {
  constructor(
    private createUseCase: CreateUseCase,
    private deleteUseCase: DeleteUseCase,
  ) {}

  public registerRoutes = (fastify: FastifyInstance, ops: any, done: any) => {
    fastify.post("/", this.create);
    fastify.get("/:id", this.getById);
    fastify.get("/", this.list);
    fastify.put("/:id/step", this.step);
    fastify.put("/:id/run", this.run);
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

  private getById = async (request: FastifyRequest, reply: FastifyReply) => {};

  private list = async (request: FastifyRequest, reply: FastifyReply) => {};

  private step = async (request: FastifyRequest, reply: FastifyReply) => {};

  private run = async (request: FastifyRequest, reply: FastifyReply) => {};

  private delete = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    await this.deleteUseCase.execute(id);

    reply.status(204).send();
  };
}
