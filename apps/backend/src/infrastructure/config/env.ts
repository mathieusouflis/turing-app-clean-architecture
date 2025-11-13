/**
 * Environment Variable Validation
 * Validates and provides type-safe access to environment variables
 */

import { z } from "zod";
import { ConfigurationError } from "../../domain/errors.js";

/**
 * Schema for environment variables
 */
const envSchema = z.object({
  PORT: z
    .string()
    .default("8080")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val < 65536, {
      message: "PORT must be between 1 and 65535",
    }),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (val) => val.startsWith("postgresql://") || val.startsWith("postgres://"),
      {
        message: "DATABASE_URL must be a valid PostgreSQL connection string",
      }
    ),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  try {
    return envSchema.parse({
      PORT: process.env.PORT,
      HOST: process.env.HOST,
      DATABASE_URL: process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      throw new ConfigurationError("Invalid environment configuration", {
        issues,
      });
    }
    throw new ConfigurationError("Failed to validate environment", { error });
  }
}

