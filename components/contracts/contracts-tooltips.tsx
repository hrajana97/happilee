"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface TooltipStep {
  id: string
  content: string
  elementId: string
}

const tooltipSteps: TooltipStep[] = [
  {
    id: "welcome",
    content:
      "Welcome to the Contracts section! Here you can manage all your vendor contracts, track payments, and important dates. Let me guide you.",
    elementId: "contracts-section",
  },
  {
    id: "upload",
    content:
      "Click here to upload a new contract. Supported formats include PDF, DOCX, and more. We'll extract key information and help you organize your contracts.",
    elementId: "upload-contract-button",
  },
  {
    id: "view",
    content:
      "Click on a contract to view its details, including payment schedules, included services, and important events. You can also add these events to your calendar.",
    elementId: "view-contract-button",
  },
  {
    id: "analyze",
    content:
      "Use the analysis tool to highlight important sections, add notes, and track follow-ups on specific points within the contract.",
    elementId: "analyze-contract-button",
  },
]

export function ContractsTooltips() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Check if tour should start
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem("contracts_tour_completed") === "true"
    if (!hasCompletedTour) {
      // Small delay to ensure elements are mounted
      const timer = setTimeout(() => {
        setIsVisible(true)
        setCurrentStep(0)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < tooltipSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    localStorage.setItem("contracts_tour_completed", "true")
  }

  if (!isVisible) return null

  const currentTooltip = tooltipSteps[currentStep]

  return (
    <div>
      {/* Component content without AssistantTooltip */}
    </div>
  )
}

