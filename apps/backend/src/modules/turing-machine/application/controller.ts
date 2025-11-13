import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateUseCase } from "./use-cases/create";
import { NewTuringMachineRecordSchema } from "../shemas/turing-machine";

export class TuringMachineController {
  constructor(private createUseCase: CreateUseCase) {}

  public registerRoutes(fastify: FastifyInstance, ops: any, done: any) {
    fastify.post("/", this.create.bind(this));
    fastify.get("/:id", this.getById.bind(this));
    fastify.get("/", this.list.bind(this));
    fastify.put("/:id/step", this.step.bind(this));
    fastify.put("/:id/run", this.run.bind(this));
    fastify.delete("/:id", this.delete.bind(this));

    done();
  }

  private async create(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body;
    const dataParsed = NewTuringMachineRecordSchema.safeParse(data);

    if (!dataParsed.success) {
      reply.status(400).send({ error: dataParsed.error.message });
      return;
    }

    const machine = await this.createUseCase.execute(dataParsed.data);

    reply.status(201).send(machine);
  }

  private async getById(request: FastifyRequest, reply: FastifyReply) {}

  private async list(request: FastifyRequest, reply: FastifyReply) {}

  private async step(request: FastifyRequest, reply: FastifyReply) {}

  private async run(request: FastifyRequest, reply: FastifyReply) {}

  private async delete(request: FastifyRequest, reply: FastifyReply) {}
}
