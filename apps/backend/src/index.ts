import dotenv from "dotenv";
import path from "path";
import cors from "@fastify/cors";
import { routesPlugin } from "./utils/routes";

const envPath = path.resolve(__dirname, "../../../../.env.dev");
dotenv.config({ path: envPath });

const PORT = parseInt(process.env.PORT || "8080", 10);
const HOST = process.env.HOST || "0.0.0.0";
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/turing_db";

server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

server.register(routesPlugin, {
  prefix: "/api",
});


const PORT = process.env.BACKEND_PORT || 8080;

start();
