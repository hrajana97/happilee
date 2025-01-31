"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AssistantCharacter } from "@/components/assistant/assistant-character"

interface TutorialProviderProps {
  children: React.ReactNode
}

interface TutorialStep {
  title: string
  content: string
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Quick Navigation",
    content:
      "Use the sidebar to quickly access different sections of your wedding planning dashboard. You can collapse it for more space!",
  },
  {
    title: "Budget Planning",
    content:
      "In the Budget section, create and track your wedding budget. Get smart suggestions based on your location and guest count, and easily monitor expenses.",
  },
  {
    title: "Style & Design",
    content:
      "Visit the Moodboard to curate your dream wedding style. Save inspiration, create color palettes, and define your wedding aesthetic.",
  },
  {
    title: "Vendor Management",
    content:
      "The Vendors section helps you source, contact, and compare vendors. Use AI-powered tools to analyze quotes and make informed decisions.",
  },
  {
    title: "Contract Analysis",
    content:
      "In Contracts, get AI-powered contract analysis to quickly understand vendor agreements. Track payment schedules and important terms.",
  },
  {
    title: "Event Timeline",
    content: "Use the Calendar to track all your wedding-related events, from vendor meetings to payment deadlines.",
  },
  {
    title: "Meet Winnie",
    content:
      "I'm always here to help! Click the wand icon in the bottom right corner anytime you need assistance with your wedding planning.",
  },
]

export default function TutorialProvider({ children }: TutorialProviderProps) {
  const [showIntro, setShowIntro] = React.useState(true)
  const [currentStep, setCurrentStep] = React.useState(0)
  const dialogId = React.useId()
  const hasCompletedOnboarding = React.useRef(localStorage.getItem("hasCompletedOnboarding") === "true")

  React.useEffect(() => {
    if (!hasCompletedOnboarding.current) {
      const timer = setTimeout(() => {
        if (currentStep === 0) {
          setShowIntro(true)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const handleStartTutorial = () => {
    setShowIntro(false)
    setCurrentStep(1)
    hasCompletedOnboarding.current = true
  }

  const handleNext = () => {
    if (currentStep < tutorialSteps.length) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setCurrentStep(0)
      localStorage.setItem("hasCompletedOnboarding", "true")
    }
  }

  if (!hasCompletedOnboarding.current) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur">
        {" "}
        {/* Added backdrop blur */}
        <Dialog open={showIntro} onOpenChange={setShowIntro}>
          <DialogContent className="sm:max-w-md" aria-describedby={dialogId}>
            <DialogTitle>Welcome to Your Wedding Planning Dashboard</DialogTitle>
            <div className="flex items-center gap-4 p-4">
              <AssistantCharacter size="lg" isWaving />
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Hi, I'm Winnie!</h2>
                <p className="text-sm text-muted-foreground">
                  Your magical wedding planning assistant. Would you like a quick tour of your planning dashboard?
                </p>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleStartTutorial} className="bg-[#738678] hover:bg-sage-700 text-white">
                    Yes, show me around
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowIntro(false)
                      localStorage.setItem("hasCompletedOnboarding", "true")
                      hasCompletedOnboarding.current = true
                    }}
                    className="border-sage-200 text-sage-700 hover:bg-sage-50"
                  >
                    Maybe later
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && typeof child.props.currentStep !== "undefined") {
            return React.cloneElement(child, { currentStep, onNext: handleNext })
          }
          return child
        })}
      </div>
    )
  }

  return children
}

