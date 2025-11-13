import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class TuringMachineController {
  public registerRoutes(fastify: FastifyInstance, ops: any, done: any) {
    fastify.post("/", () => this.create);
    fastify.get("/:id", () => this.getById);
    fastify.get("/", () => this.list);
    fastify.put("/:id/step", () => this.step);
    fastify.put("/:id/run", () => this.run);
    fastify.delete("/:id", () => this.delete);

    done();
  }

  private async create(request: FastifyRequest, reply: FastifyReply) {
    // const data = request.body;
  }

  private async getById(request: FastifyRequest, reply: FastifyReply) {}

  private async list(request: FastifyRequest, reply: FastifyReply) {}

  private async step(request: FastifyRequest, reply: FastifyReply) {}

  private async run(request: FastifyRequest, reply: FastifyReply) {}

  private async delete(request: FastifyRequest, reply: FastifyReply) {}
}
