import dotenv from "dotenv";
import path from "path";
import { createServer } from "./server.js";

const envPath = path.resolve(__dirname, "../../../../.env.dev");
dotenv.config({ path: envPath });

const PORT = parseInt(process.env.PORT || "8080", 10);
const HOST = process.env.HOST || "0.0.0.0";
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/turing_db";

async function start() {
  try {
    // Create and configure server
    const server = await createServer(DATABASE_URL);

    // Start listening
    await server.listen({ port: PORT, host: HOST });
    
    console.log(`Server listening at http://${HOST}:${PORT}`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
