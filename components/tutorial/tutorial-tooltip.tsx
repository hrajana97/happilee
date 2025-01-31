'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AssistantCharacter } from '../assistant/assistant-character'

interface TutorialTooltipProps {
  content: string
  children: React.ReactNode
  step: number
  currentStep: number
  onNext: () => void
  className?: string
  side?: "top" | "right" | "bottom" | "left"
}

export function TutorialTooltip({
  content,
  children,
  step,
  currentStep,
  onNext,
  className,
  side = "right"
}: TutorialTooltipProps) {
  const isActive = step === currentStep
  const tooltipId = React.useId()

  return (
    <TooltipProvider>
      <Tooltip open={isActive}>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "rounded-lg transition-all duration-300",
              isActive && "ring-2 ring-sage-600 ring-offset-2",
              className
            )}
            aria-describedby={isActive ? tooltipId : undefined}
          >
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent
          id={tooltipId}
          side={side}
          className="w-80 p-4"
          sideOffset={12}
        >
          <div className="flex items-start gap-3 mb-3">
            <AssistantCharacter size="sm" />
            <p className="text-sm">{content}</p>
          </div>
          <Button 
            size="sm" 
            onClick={onNext}
            className="w-full bg-sage-600 hover:bg-sage-700 text-white"
          >
            {step === 7 ? 'Got it!' : 'Next'}
          </Button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

