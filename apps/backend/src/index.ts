import fastify from "fastify";
import dotenv from "dotenv";
import path from "path";
import { routesPlugin } from "./utils/routes";

const envPath = path.resolve(__dirname, "../../../../.env.dev");
dotenv.config({ path: envPath });

const server = fastify();

server.register(routesPlugin, {
  prefix: "/api",
});

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.addHook("onRequest", async (request, reply) => {
  console.info("[INFO]", request.method, request.url);
});

server.addHook("onError", async (request, reply, error) => {
  throw new Error(error.message, {
    cause: error.cause,
  });
});

const PORT = process.env.BACKEND_PORT || 8080;

server.listen(
  { port: Number(PORT), host: process.env.BACKEND_HOST || "0.0.0.0" },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  },
);
