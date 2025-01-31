"use client"

import * as React from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { logger } from "@/lib/debug"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [errorMessage, setErrorMessage] = React.useState<string>("")
  const [showDebugInfo, setShowDebugInfo] = React.useState(false)
  const [debugInfo, setDebugInfo] = React.useState<string>("")

  useEffect(() => {
    // Log the full error object for debugging
    logger.error("Global error occurred:", error)

    // Collect debug information
    const debug = {
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        digest: error?.digest,
      },
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    setDebugInfo(JSON.stringify(debug, null, 2))

    // Handle empty error objects
    if (!error || Object.keys(error).length === 0) {
      setErrorMessage("An unexpected error occurred. Please try again.")
    } else {
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.")
    }
  }, [error])

  const handleReset = () => {
    try {
      logger.info("Attempting error recovery...")
      // Clear all state before resetting
      if (typeof window !== "undefined") {
        localStorage.clear()
        logger.debug("Cleared localStorage")
      }
      reset()
    } catch (e) {
      logger.error("Error during reset:", e)
      window.location.reload()
    }
  }

  const handleCopyDebugInfo = () => {
    navigator.clipboard
      .writeText(debugInfo)
      .then(() => alert("Debug info copied to clipboard"))
      .catch((err) => logger.error("Failed to copy debug info:", err))
  }

  return (
    <html>
      <body>
        <div className="flex min-h-screen w-full items-center justify-center p-4">
          <div className="text-center max-w-2xl bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-sage-200">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-sage-600" />
            </div>
            <h2 className="text-lg font-semibold mb-2 text-sage-900">Application Error</h2>
            <p className="text-sm text-sage-600 mb-4">{errorMessage}</p>

            <div className="flex gap-4 justify-center mb-4">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/dashboard")}
                className="border-sage-200 text-sage-700 hover:bg-sage-50"
              >
                Return to Dashboard
              </Button>
              <Button onClick={handleReset} className="bg-sage-600 hover:bg-sage-700">
                Try again
              </Button>
            </div>

            <div className="mt-8 text-left">
              <Button variant="outline" onClick={() => setShowDebugInfo(!showDebugInfo)} className="mb-4">
                {showDebugInfo ? "Hide" : "Show"} Debug Information
              </Button>

              {showDebugInfo && (
                <div className="mt-4">
                  <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-[400px]">{debugInfo}</pre>
                  <Button variant="outline" onClick={handleCopyDebugInfo} className="mt-2">
                    Copy Debug Info
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

