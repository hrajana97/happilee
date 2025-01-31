import { logger } from "./debug"

export class AppError extends Error {
  public code?: string
  public details?: unknown
  public timestamp: string

  constructor(message: string, code?: string, details?: unknown) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()

    // Ensure proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }

    // Log the error immediately
    logger.error(`${code || "ERROR"}: ${message}`, {
      details,
      stack: this.stack,
    })
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    }
  }
}

export function handleError(error: unknown): AppError {
  logger.debug("Handling error", { error })

  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(error.message, "UNKNOWN_ERROR", {
      originalError: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    })
  }

  return new AppError("An unexpected error occurred", "UNKNOWN_ERROR", { originalError: error })
}

