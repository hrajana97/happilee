"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { storage } from "@/lib/storage"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

const steps = [
  {
    id: "welcome",
    name: "Welcome",
    fields: ["name", "partnerName"],
  },
  {
    id: "details",
    name: "Wedding Details",
    fields: ["date", "guests", "budget"],
  },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [name, setName] = useState("")
  const [partnerName, setPartnerName] = useState("")
  const [weddingDate, setWeddingDate] = useState("")
  const [guestCount, setGuestCount] = useState([100])
  const [budget, setBudget] = useState([50000])
  const router = useRouter()

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      // Save data and redirect to dashboard
      storage.setUserData({
        name,
        partnerName: partnerName || undefined,
        weddingDate,
        budget: budget[0],
        guestCount: guestCount[0],
      })

      // Set demo mode in localStorage
      localStorage.setItem("happily_auth", "true")
      localStorage.setItem("happily_user_type", "demo")

      router.push("/dashboard")
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  return (
    <div className="gradient-bg min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <div className="flex gap-4">
            <Button variant="ghost" asChild className="text-sage-600 hover:text-sage-700">
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>

        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="text-sage-900">
              {currentStep === 0 ? "Let's plan your dream wedding!" : "Wedding Details"}
            </CardTitle>
            <CardDescription className="text-sage-600">
              {currentStep === 0 ? "Let's start with some basic information" : "Help us understand your vision"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sage-700">
                    What should we call you?
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-white/50 border-sage-200 focus:border-[#738678]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerName" className="text-sage-700">
                    What is your partner's name? (Optional)
                  </Label>
                  <Input
                    id="partnerName"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Enter your partner's name"
                    className="bg-white/50 border-sage-200 focus:border-[#738678]"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sage-700">
                    Wedding Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="bg-white/50 border-sage-200 focus:border-[#738678]"
                    required
                  />
                  <p className="text-sm text-sage-600">
                    If you're not sure on the exact date, feel free to select the first of whichever month you're
                    considering.
                  </p>
                </div>
                <div className="space-y-4">
                  <Label className="text-sage-700">Expected Guest Count</Label>
                  <div className="space-y-3">
                    <Slider
                      value={guestCount}
                      onValueChange={setGuestCount}
                      max={450}
                      step={10}
                      className="py-4 [&>[role=slider]]:bg-[#738678] [&>[role=slider]]:border-[#738678] [&>.range]:bg-[#738678]"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-sage-600">Guests:</span>
                      <span className="font-medium text-sage-900">{guestCount[0]}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-sage-700">Budget Range</Label>
                  <div className="space-y-3">
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      min={1000}
                      max={250000}
                      step={1000}
                      className="w-full [&>[role=slider]]:bg-[#738678] [&>[role=slider]]:border-[#738678] [&>.range]:bg-[#738678]"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-sage-600">Budget:</span>
                      <span className="font-medium text-sage-900">
                        {budget[0] === 250000 ? "$250k+" : formatCurrency(budget[0])}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="text-sage-600 hover:text-sage-700 border-sage-200 hover:bg-sage-50"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="w-full sm:w-auto bg-[#738678] hover:bg-[#4A5D4E] text-white"
                disabled={currentStep === 0 && !name}
              >
                {currentStep === steps.length - 1 ? "Start Planning" : "Next"}
              </Button>
            </div>

            <div className="flex justify-center space-x-2 pt-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                    index === currentStep ? "bg-sage-600" : "bg-sage-200"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

