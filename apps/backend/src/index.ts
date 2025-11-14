import fastify from "fastify";
import dotenv from "dotenv";
import path from "path";
import { routesPlugin } from "./utils/routes";
import fastifyCors from "@fastify/cors";

let envPath = path.resolve(__dirname, "../../../../.env");
dotenv.config({ path: envPath });

if (process.env.NODE_ENV === "production") {
  envPath = path.resolve(__dirname, "../../../../.env.prod");
  dotenv.config({ path: envPath });
} else if (process.env.NODE_ENV === "development") {
  envPath = path.resolve(__dirname, "../../../../.env.dev");
  dotenv.config({ path: envPath });
}
const server = fastify();

server.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
});

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
