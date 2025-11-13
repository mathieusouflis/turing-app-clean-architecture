// import fastify from "fastify";

import { FastifyInstance } from "fastify";

export class TapeController {
  public registerRoutes(fastify: FastifyInstance, ops: any, done: any) {
    fastify.post("/", () => {});
    fastify.get("/:id", () => {});
    fastify.get("/", () => {});
    fastify.put("/:id/step", () => {});
    fastify.put("/:id/run", () => {});
    fastify.delete("/:id", () => {});

    done();
  }
}
