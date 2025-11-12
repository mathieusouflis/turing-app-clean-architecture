import fastify from "fastify";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../../.env.dev");
dotenv.config({ path: envPath });

const server = fastify();

server.get("/ping", async (request, reply) => {
  return "pong\n";
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
