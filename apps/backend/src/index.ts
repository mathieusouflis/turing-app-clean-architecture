/**
 * Entry Point
 * Starts the Fastify server with database connection
 */

import { createServer } from "./server.js";
import { validateEnv } from "./infrastructure/config/env.js";
import { ConfigurationError } from "./domain/errors.js";

async function start() {
  try {
    // Validate environment variables
    const config = validateEnv();

    // Create and configure server
    const server = await createServer(config.DATABASE_URL);

    // Start listening
    await server.listen({ port: config.PORT, host: config.HOST });
    
    console.log(`Server listening at http://${config.HOST}:${config.PORT}`);
  } catch (error) {
    if (error instanceof ConfigurationError) {
      console.error("Configuration error:", error.message);
      if (error.context) {
        console.error("Details:", JSON.stringify(error.context, null, 2));
      }
    } else {
      console.error("Failed to start server:", error);
    }
    process.exit(1);
  }
}

start();
