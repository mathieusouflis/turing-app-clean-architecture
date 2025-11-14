import fastify from "fastify";
import dotenv from "dotenv";
import path from "path";
import cors from "@fastify/cors";
import { routesPlugin } from "./utils/routes";

const envPath = path.resolve(__dirname, "../../../../.env.dev");
dotenv.config({ path: envPath });

const server = fastify();

server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

server.register(routesPlugin, {
  prefix: "/api",
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
