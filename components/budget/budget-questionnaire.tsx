"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BudgetData } from "@/types/budget"
import { storage } from "@/lib/storage"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BudgetQuestionnaireProps {
  onComplete: (data: {
    location: BudgetData["location"]
    guestCount: number
    priorities: string[]
  }) => void
}

const BudgetQuestionnaire: React.FC<BudgetQuestionnaireProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1)
  const [location, setLocation] = useState<BudgetData["location"] & { state?: string; zipCode?: string }>({
    city: "",
    state: "",
    country: "United States",
    isDestination: false,
    zipCode: "",
  })
  const [guestCount, setGuestCount] = useState(100)
  const [priorities, setPriorities] = useState<string[]>([])
  const [userData, setUserData] = useState(storage.getUserData())

  // Use effect to handle hydration mismatch
  useEffect(() => {
    setUserData(storage.getUserData())
  }, [])

  // Add state reset on mount
  useEffect(() => {
    // Clear any stale questionnaire state
    if (typeof window !== "undefined") {
      localStorage.removeItem("budget_questionnaire_state")
    }
  }, [])

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      onComplete({
        location: {
          city: location.city,
          state: location.isDestination ? undefined : location.state,
          country: location.country,
          isDestination: location.isDestination,
          weddingDate: userData.weddingDate,
        },
        guestCount,
        priorities,
      })
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const priorityOptions = [
    "venue",
    "catering",
    "photography",
    "entertainment",
    "flowers",
    "attire",
    "transportation",
    "large guest list",
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sage-50/50 to-white p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-8 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#4A5D4E]">Wedding Budget Calculator</h1>
              <p className="mt-2 text-sm sm:text-base text-[#4A5D4E]">
                Let's create your personalized wedding budget based on your location and preferences
              </p>
            </div>
          </div>
        </div>

        <Progress value={(step / 2) * 100} className="mb-8 bg-sage-200 [&>[role=progressbar]]:bg-sage-700" />

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Wedding Details</h2>

              <div className="space-y-2">
                <Label>Wedding Date</Label>
                <p className="text-sm text-sage-600">This helps us account for seasonal pricing variations.</p>
                <Input
                  type="date"
                  defaultValue={userData.weddingDate?.split("T")[0]}
                  onChange={(e) => {
                    const newData = {
                      ...userData,
                      weddingDate: new Date(e.target.value).toISOString(),
                    }
                    setUserData(newData)
                    storage.setUserData(newData)
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="destination"
                    checked={location.isDestination}
                    onCheckedChange={(checked) =>
                      setLocation((prev) => ({ ...prev, isDestination: checked as boolean }))
                    }
                  />
                  <label htmlFor="destination" className="text-sm font-medium leading-none">
                    This is a destination wedding
                  </label>
                </div>
              </div>

              {location.isDestination ? (
                <>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      placeholder="Enter city"
                      value={location.city}
                      onChange={(e) => setLocation((prev) => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      placeholder="Enter country"
                      value={location.country}
                      onChange={(e) => setLocation((prev) => ({ ...prev, country: e.target.value }))}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      placeholder="Enter city"
                      value={location.city}
                      onChange={(e) => setLocation((prev) => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Select
                      value={location.state}
                      onValueChange={(value) => setLocation((prev) => ({ ...prev, state: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* US States */}
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="AK">Alaska</SelectItem>
                        <SelectItem value="AZ">Arizona</SelectItem>
                        <SelectItem value="AR">Arkansas</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="CO">Colorado</SelectItem>
                        <SelectItem value="CT">Connecticut</SelectItem>
                        <SelectItem value="DE">Delaware</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="GA">Georgia</SelectItem>
                        <SelectItem value="HI">Hawaii</SelectItem>
                        <SelectItem value="ID">Idaho</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                        <SelectItem value="IN">Indiana</SelectItem>
                        <SelectItem value="IA">Iowa</SelectItem>
                        <SelectItem value="KS">Kansas</SelectItem>
                        <SelectItem value="KY">Kentucky</SelectItem>
                        <SelectItem value="LA">Louisiana</SelectItem>
                        <SelectItem value="ME">Maine</SelectItem>
                        <SelectItem value="MD">Maryland</SelectItem>
                        <SelectItem value="MA">Massachusetts</SelectItem>
                        <SelectItem value="MI">Michigan</SelectItem>
                        <SelectItem value="MN">Minnesota</SelectItem>
                        <SelectItem value="MS">Mississippi</SelectItem>
                        <SelectItem value="MO">Missouri</SelectItem>
                        <SelectItem value="MT">Montana</SelectItem>
                        <SelectItem value="NE">Nebraska</SelectItem>
                        <SelectItem value="NV">Nevada</SelectItem>
                        <SelectItem value="NH">New Hampshire</SelectItem>
                        <SelectItem value="NJ">New Jersey</SelectItem>
                        <SelectItem value="NM">New Mexico</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="NC">North Carolina</SelectItem>
                        <SelectItem value="ND">North Dakota</SelectItem>
                        <SelectItem value="OH">Ohio</SelectItem>
                        <SelectItem value="OK">Oklahoma</SelectItem>
                        <SelectItem value="OR">Oregon</SelectItem>
                        <SelectItem value="PA">Pennsylvania</SelectItem>
                        <SelectItem value="RI">Rhode Island</SelectItem>
                        <SelectItem value="SC">South Carolina</SelectItem>
                        <SelectItem value="SD">South Dakota</SelectItem>
                        <SelectItem value="TN">Tennessee</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="UT">Utah</SelectItem>
                        <SelectItem value="VT">Vermont</SelectItem>
                        <SelectItem value="VA">Virginia</SelectItem>
                        <SelectItem value="WA">Washington</SelectItem>
                        <SelectItem value="WV">West Virginia</SelectItem>
                        <SelectItem value="WI">Wisconsin</SelectItem>
                        <SelectItem value="WY">Wyoming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>ZIP Code (Optional)</Label>
                    <p className="text-sm text-sage-600">
                      This helps us provide more accurate cost estimates for your area.
                    </p>
                    <Input
                      placeholder="Enter ZIP code"
                      value={location.zipCode}
                      onChange={(e) => setLocation((prev) => ({ ...prev, zipCode: e.target.value }))}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#4A5D4E]">Expected Guest Count</Label>
                <div className="pt-4">
                  <Slider
                    value={[guestCount]}
                    onValueChange={(value) => setGuestCount(value[0])}
                    max={500}
                    step={10}
                    className="py-4 [&>[role=slider]]:bg-[#4A5D4E] [&>[role=slider]]:border-[#4A5D4E] [&>.range]:bg-[#4A5D4E]"
                  />
                </div>
                <div className="flex justify-between text-sm text-[#4A5D4E]">
                  <span>0 guests</span>
                  <span>{guestCount} guests</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#4A5D4E]">Top Priorities (Select up to 3)</Label>
              <p className="text-sm text-sage-600">
                We'll allocate a larger portion of the budget to these categories.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {priorityOptions.map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={priority}
                      checked={priorities.includes(priority)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          if (priorities.length < 3) {
                            setPriorities([...priorities, priority])
                          }
                        } else {
                          setPriorities(priorities.filter((p) => p !== priority))
                        }
                      }}
                    />
                    <label htmlFor={priority} className="text-sm font-medium leading-none capitalize text-[#4A5D4E]">
                      {priority}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 pt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="w-full sm:w-auto bg-sage-50 hover:bg-sage-100 text-[#4A5D4E] border-sage-200"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && (!location.city || (!location.isDestination && !location.state))) ||
              (step === 2 && priorities.length === 0)
            }
            className="w-full sm:w-auto bg-[#738678] hover:bg-[#4A5D4E] text-white"
          >
            {step === 2 ? "Calculate Budget" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BudgetQuestionnaire

