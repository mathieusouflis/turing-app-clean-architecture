import { TuringMachineController } from "@/modules/turing-machine/application/controller";
import { FastifyInstance } from "fastify";

export function routesPlugin(fastify: FastifyInstance, ops: any, done: any) {
  fastify.register(new TuringMachineController().registerRoutes, {
    prefix: "/tapes",
  });

  done();
}
