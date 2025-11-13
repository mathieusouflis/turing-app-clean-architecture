import { TapeController } from "@/modules/tape/application/controller";
import { FastifyInstance } from "fastify";

export function routesPlugin(fastify: FastifyInstance, ops: any, done: any) {
  fastify.register(new TapeController().registerRoutes, {
    prefix: "/tapes",
  });

  done();
}
