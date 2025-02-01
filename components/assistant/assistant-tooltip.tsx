"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AssistantCharacter } from "./assistant-character"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { X, ArrowLeft, ArrowRight } from "lucide-react"

interface AssistantTooltipProps {
  tip: string
  children?: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
  targetId?: string
  onClose?: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export function AssistantTooltip({
  tip,
  children,
  side = "right",
  className,
  targetId,
  onClose,
  onNext,
  onPrevious,
}: AssistantTooltipProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (targetId) {
      const element = document.getElementById(targetId)
      if (element) {
        setTargetElement(element)
        // Add a highlight effect to the target element
        element.style.position = "relative"
        element.style.zIndex = "50"
        element.classList.add("ring-2", "ring-sage-600", "ring-offset-2", "rounded-lg")

        return () => {
          element.style.position = ""
          element.style.zIndex = ""
          element.classList.remove("ring-2", "ring-sage-600", "ring-offset-2", "rounded-lg")
        }
      }
    }
  }, [targetId])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false)
      }, 5000) // Hide after 5 seconds
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleNextClick = () => {
    if (onNext) {
      onNext()
    }
    // Note: We no longer call setIsOpen(false) here
    // The parent component will handle closing the tooltip
    // when all steps are complete
  }

  const handlePreviousClick = () => {
    if (onPrevious) {
      onPrevious()
    }
  }

  const tooltipContent = (
    <div className="w-80 p-4 pt-8 relative animate-in fade-in-0 fade-out-0 duration-1000">
      {/* Add close button at top right */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsOpen(false)}
        className="absolute right-2 top-2 text-sage-600 hover:text-sage-700"
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Main content */}
      <div className="flex items-start gap-3 mb-3">
        <AssistantCharacter size="sm" />
        <p className="text-sm text-sage-700">{tip}</p>
      </div>
    </div>
  )

  // If we have a targetElement but no children, create a tooltip around that element
  if (targetElement && !children) {
    return (
      <TooltipProvider>
        <Tooltip open={isOpen}>
          <TooltipTrigger asChild>
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50" />
          </TooltipTrigger>
          <TooltipContent
            side={side}
            className="p-0"
            sideOffset={12}
            align="center"
            alignOffset={40} // Updated alignOffset
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Otherwise, wrap the children
  return (
    <TooltipProvider>
      <Tooltip open={isOpen}>
        <TooltipTrigger asChild>
          <div className={className}>{children}</div>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className="p-0"
          sideOffset={12}
          align="center"
          alignOffset={40} // Updated alignOffset
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

