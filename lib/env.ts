export function validateEnv() {
  const requiredEnvVars = ["NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_API_URL"]

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }
}

