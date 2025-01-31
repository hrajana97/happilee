"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { logger } from "@/lib/debug"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error & { digest?: string }
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("Error caught by boundary:", {
      error,
      componentStack: errorInfo.componentStack,
      digest: (error as any).digest,
    })
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
    // Clear any cached data that might be causing the issue
    if (typeof window !== "undefined") {
      // Clear only specific caches that might be relevant
      const keysToKeep = ["happily_auth", "happily_user_type"]
      Object.keys(localStorage).forEach((key) => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key)
        }
      })

      // Clear session storage
      sessionStorage.clear()

      // Reload only necessary chunks
      if (window.location.pathname === "/dashboard/calendar") {
        window.location.reload()
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] w-full items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-sage-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-sage-600 mb-4">
              {this.state.error?.message || "An unexpected error occurred while loading the calendar."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/dashboard")}
                className="border-sage-200 text-sage-700 hover:bg-sage-50"
              >
                Return to Dashboard
              </Button>
              <Button onClick={this.handleRetry} className="bg-sage-600 hover:bg-sage-700">
                Try again
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

