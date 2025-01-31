import type { ChunkLoadError } from "next/dist/client/route-loader"

type LogLevel = "debug" | "info" | "warn" | "error"

class Logger {
  private static instance: Logger
  private isDebugMode: boolean
  private chunkRetryCount: Map<string, number> = new Map()

  private constructor() {
    this.isDebugMode = process.env.NODE_ENV !== "production" || process.env.DEBUG === "true"
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${data ? "\nData: " + JSON.stringify(data, null, 2) : ""}`
  }

  private isChunkLoadError(error: any): error is ChunkLoadError {
    return error?.name === "ChunkLoadError" || (error?.message && error.message.includes("Loading chunk"))
  }

  debug(message: string, data?: any) {
    if (this.isDebugMode) {
      console.debug(this.formatMessage("debug", message, data))
    }
  }

  info(message: string, data?: any) {
    console.info(this.formatMessage("info", message, data))
  }

  warn(message: string, data?: any) {
    console.warn(this.formatMessage("warn", message, data))
  }

  error(message: string, error?: any) {
    // Special handling for chunk load errors
    if (error && this.isChunkLoadError(error)) {
      const chunkId = error.message.match(/Loading chunk (\d+) failed/)?.[1]
      if (chunkId) {
        const retryCount = this.chunkRetryCount.get(chunkId) || 0
        if (retryCount < 3) {
          // Limit retries
          this.chunkRetryCount.set(chunkId, retryCount + 1)
          console.warn(`Chunk ${chunkId} load failed, retrying... (${retryCount + 1}/3)`)
          // Trigger a reload after a short delay
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.location.reload()
            }
          }, 1000)
          return
        }
      }
    }

    console.error(
      this.formatMessage("error", message, {
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
                ...error,
              }
            : error,
      }),
    )
  }

  clearRetryCount() {
    this.chunkRetryCount.clear()
  }
}

export const logger = Logger.getInstance()

