import { logger } from "./debug"

interface Config {
  apiUrl: string
  environment: "development" | "production" | "test"
  debug: boolean
}

export function validateConfig(): Config {
  try {
    logger.debug("Starting config validation")

    // Check if required environment variables exist
    const requiredVars = ["NEXT_PUBLIC_API_URL"]
    const missingVars = requiredVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      logger.warn(`Missing environment variables: ${missingVars.join(", ")}. Using defaults.`)
    }

    // Provide fallback values for required environment variables
    const config = {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api", // Added /api path
      environment: (process.env.NODE_ENV || "development") as Config["environment"],
      debug: process.env.DEBUG === "true" || process.env.NODE_ENV === "development",
    }

    logger.debug("Config validation successful", config)
    return config
  } catch (error) {
    logger.error("Configuration validation failed", error)
    // Return default config instead of throwing
    return {
      apiUrl: "http://localhost:3000/api", // Added /api path
      environment: "development",
      debug: true,
    }
  }
}

