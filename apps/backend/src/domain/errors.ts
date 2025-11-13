/**
 * Domain Error Types
 * Custom error classes for the application with proper context and IDs
 */

/**
 * Base error class for all domain errors
 * Provides consistent error structure with context
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Serializes error to JSON for API responses
   */
  toJSON(): {
    error: string;
    code: string;
    message: string;
    context?: Record<string, unknown>;
  } {
    return {
      error: this.name,
      code: this.code,
      message: this.message,
      ...(this.context && { context: this.context }),
    };
  }
}

/**
 * Error when a tape is not found
 */
export class TapeNotFoundError extends DomainError {
  readonly code = "TAPE_NOT_FOUND";
  readonly statusCode = 404;

  constructor(tapeId: string) {
    super(`Tape with ID '${tapeId}' not found`, { tapeId });
  }
}

/**
 * Error when validation fails
 */
export class ValidationError extends DomainError {
  readonly code = "VALIDATION_ERROR";
  readonly statusCode = 400;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
  }
}

/**
 * Error when a database operation fails
 */
export class DatabaseError extends DomainError {
  readonly code = "DATABASE_ERROR";
  readonly statusCode = 500;

  constructor(message: string, context?: Record<string, unknown>) {
    super(`Database error: ${message}`, context);
  }
}

/**
 * Error when a Turing machine operation fails
 */
export class TuringMachineError extends DomainError {
  readonly code = "TURING_MACHINE_ERROR";
  readonly statusCode = 400;

  constructor(message: string, context?: Record<string, unknown>) {
    super(`Turing machine error: ${message}`, context);
  }
}

/**
 * Error when maximum steps exceeded
 */
export class MaxStepsExceededError extends DomainError {
  readonly code = "MAX_STEPS_EXCEEDED";
  readonly statusCode = 400;

  constructor(maxSteps: number, stepsExecuted: number, tapeId?: string) {
    super(
      `Maximum steps (${maxSteps}) exceeded. Executed ${stepsExecuted} steps before stopping.`,
      { maxSteps, stepsExecuted, ...(tapeId && { tapeId }) }
    );
  }
}

/**
 * Error when environment configuration is invalid
 */
export class ConfigurationError extends DomainError {
  readonly code = "CONFIGURATION_ERROR";
  readonly statusCode = 500;

  constructor(message: string, context?: Record<string, unknown>) {
    super(`Configuration error: ${message}`, context);
  }
}

