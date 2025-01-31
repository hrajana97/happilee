'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'

export default function BudgetError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  useEffect(() => {
    console.error('Error in budget page:', error)

    if (!error || Object.keys(error).length === 0) {
      setErrorMessage('There was an error loading your budget data. Please try again.')
    } else {
      setErrorMessage(error.message || 'There was an error loading your budget data. Please try again.')
    }
  }, [error])

  const handleReset = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('happilai_budget_data')
      }
      reset()
    } catch (e) {
      console.error('Error during reset:', e)
      window.location.reload()
    }
  }

  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Budget Error</h2>
        <p className="text-sm text-sage-600 mb-4">
          {errorMessage}
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline"
            onClick={handleReset}
          >
            Reset Budget Data
          </Button>
          <Button 
            onClick={() => reset()}
            className="bg-sage-600 hover:bg-sage-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}

