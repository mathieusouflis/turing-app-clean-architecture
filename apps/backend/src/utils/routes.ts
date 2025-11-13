import { TapeController } from "@/modules/tape/application/controller";
import { FastifyInstance } from "fastify";

export function routesPlugin(fastify: FastifyInstance, ops: any, done: any) {
  const controller = new TapeController();
  fastify.register(
    (fastifyInstance: FastifyInstance, registerOps: any, registerDone: any) => {
      controller.registerRoutes(fastifyInstance, registerOps, registerDone);
    },
    {
      prefix: "/tapes",
    },
  );

  done();
}
