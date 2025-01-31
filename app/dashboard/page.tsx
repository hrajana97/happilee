"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  FileText,
  Image,
  Calendar,
  DollarSign,
  CalendarClock,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Palette,
  Store,
} from "lucide-react"
import Link from "next/link"
import { storage, type UserData } from "@/lib/storage"
import { WeddingCountdown } from "@/components/wedding-countdown"
import { Progress } from "@/components/ui/progress"
import { AssistantCharacter } from "@/components/assistant/assistant-character"
import { UpcomingEvents } from "@/components/upcoming-events"
import { TutorialTooltip } from "@/components/tutorial/tutorial-tooltip"
import TutorialProvider from "@/components/tutorial/tutorial-provider"
import "./page.module.css"
import { ErrorBoundary } from "@/components/ui/error-boundary"

const features = [
  {
    name: "Vendors",
    href: "/dashboard/vendors",
    icon: Users,
    progress: "2 of 8 vendors booked",
    bgColor: "bg-gradient-to-br from-sage-50 to-sage-100",
    iconColor: "bg-sage-100",
    hoverColor: "hover:shadow-sage-100/50",
    borderColor: "border-sage-200/50",
  },
  {
    name: "Budget",
    href: "/dashboard/budget",
    icon: DollarSign,
    progress: "Track your wedding expenses",
    bgColor: "bg-gradient-to-br from-sage-50 to-sage-100",
    iconColor: "bg-sage-100",
    hoverColor: "hover:shadow-sage-100/50",
    borderColor: "border-sage-200/50",
  },
  {
    name: "Contracts",
    href: "/dashboard/contracts",
    icon: FileText,
    progress: "3 contracts pending review",
    bgColor: "bg-gradient-to-br from-sage-50 to-sage-100",
    iconColor: "bg-sage-100",
    hoverColor: "hover:shadow-sage-100/50",
    borderColor: "border-sage-200/50",
  },
  {
    name: "Moodboard",
    href: "/dashboard/moodboard",
    icon: Image,
    progress: "24 inspiration images saved",
    bgColor: "bg-gradient-to-br from-sage-50 to-sage-100",
    iconColor: "bg-sage-100",
    hoverColor: "hover:shadow-sage-100/50",
    borderColor: "border-sage-200/50",
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: CalendarClock,
    progress: "8 upcoming events",
    bgColor: "bg-gradient-to-br from-sage-50 to-sage-100",
    iconColor: "bg-sage-100",
    hoverColor: "hover:shadow-sage-100/50",
    borderColor: "border-sage-200/50",
  },
]

// Demo data
const demoData: UserData = {
  name: "Alex",
  partnerName: "Jordan",
  weddingDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
  budget: 45000,
  guestCount: 120,
}

interface DashboardPageProps {
  currentStep?: number
  onNext?: () => void
}

export default function DashboardPage({ currentStep = 0, onNext = () => {} }: DashboardPageProps) {
  const [userData, setUserData] = useState<Partial<UserData>>({})

  useEffect(() => {
    const storedData = storage.getUserData()
    setUserData(Object.keys(storedData).length > 0 ? storedData : demoData)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <TutorialProvider>
      <div className="min-h-screen bg-gradient-to-b from-sage-50 via-sage-50/50 to-white p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-sage-900">
              Welcome, {userData.name}
              {userData.partnerName && ` & ${userData.partnerName}`}!
            </h1>
            <p className="mt-2 text-sage-600">Here's what's happening with your wedding planning with happilee</p>
          </div>

          {/* Moved this card to a client component */}
          {currentStep === 0 && localStorage.getItem("hasCompletedOnboarding") === "true" && (
            <div className="fixed top-4 right-4 z-50 max-w-xs">
              <AssistantOnboardingComplete />
            </div>
          )}

          <div className="grid gap-6 mb-8 md:grid-cols-2">
            {userData.weddingDate && (
              <>
                <Card className="bg-gradient-to-br from-sage-50/80 to-sage-100/60 border-sage-200/50 hover:shadow-lg transition-all duration-300 relative">
                  <CardContent className="p-6">
                    <div className="grid gap-6">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-4 group">
                          <div className="p-2 rounded-lg bg-sage-100/60 transition-all duration-300 group-hover:scale-110">
                            <Calendar className="h-6 w-6 text-[#4A5D4E] animate-[pulse_4s_ease-in-out_infinite]" />
                          </div>
                          <div>
                            <p className="text-sm text-[#4A5D4E]/70">Wedding Date</p>
                            <p className="font-medium text-[#4A5D4E]">{formatDate(userData.weddingDate)}</p>
                          </div>
                        </div>

                        {userData.guestCount !== undefined && (
                          <div className="flex items-center gap-4 group">
                            <div className="p-2 rounded-lg bg-sage-100/60 transition-all duration-300 group-hover:scale-110">
                              <Users className="h-6 w-6 text-[#4A5D4E] animate-[pulse_4s_ease-in-out_infinite]" />
                            </div>
                            <div>
                              <p className="text-sm text-[#4A5D4E]/70">Guest Count</p>
                              <p className="font-medium text-[#4A5D4E]">{userData.guestCount} guests</p>
                            </div>
                          </div>
                        )}

                        {userData.budget !== undefined && (
                          <div className="flex items-center gap-4 group">
                            <div className="p-2 rounded-lg bg-sage-100/60 transition-all duration-300 group-hover:scale-110">
                              <DollarSign className="h-6 w-6 text-[#4A5D4E] animate-[pulse_4s_ease-in-out_infinite]" />
                            </div>
                            <div>
                              <p className="text-sm text-[#4A5D4E]/70">Budget</p>
                              <p className="font-medium text-[#4A5D4E]">{formatCurrency(userData.budget)}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-2 border-t border-sage-200/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-sage-600 animate-[bounce_2s_ease-in-out_infinite]" />
                            <span className="text-sm font-medium text-sage-700">Planning Progress</span>
                          </div>
                          <span className="text-sm text-sage-600">
                            {localStorage.getItem("happilai_user_type") !== "demo" ? "0%" : "65%"}
                          </span>
                        </div>
                        <Progress
                          value={localStorage.getItem("happilai_user_type") !== "demo" ? 0 : 65}
                          className="h-2"
                        />
                      </div>
                      <WeddingCountdown
                        date={userData.weddingDate}
                        className="border-none shadow-none bg-transparent"
                      />
                    </div>
                  </CardContent>
                </Card>
                <UpcomingEvents />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
            <TutorialTooltip
              step={1}
              currentStep={currentStep}
              onNext={onNext}
              content="Create and manage your wedding budget. Track expenses, set category limits, and stay on top of your spending."
            >
              <Link href="/dashboard/budget">
                <Card className="bg-[#E8EDE7] hover:bg-[#DFE5DE] transition-colors border-sage-200 h-[140px]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-sage-200/50">
                    <CardTitle className="text-lg font-semibold text-[#4A5D4E]">Budget</CardTitle>
                    <Wallet className="h-5 w-5 text-[#738678]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Track your wedding expenses</p>
                  </CardContent>
                </Card>
              </Link>
            </TutorialTooltip>

            <TutorialTooltip
              step={2}
              currentStep={currentStep}
              onNext={onNext}
              content="Design your perfect wedding. Save inspiration, create color palettes, and define your wedding style."
            >
              <Link href="/dashboard/moodboard">
                <Card className="bg-[#E8EDE7] hover:bg-[#DFE5DE] transition-colors border-sage-200 h-[140px]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-sage-200/50">
                    <CardTitle className="text-lg font-semibold text-[#4A5D4E]">Moodboard</CardTitle>
                    <Palette className="h-5 w-5 text-[#738678]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Create your wedding style</p>
                  </CardContent>
                </Card>
              </Link>
            </TutorialTooltip>

            <TutorialTooltip
              step={3}
              currentStep={currentStep}
              onNext={onNext}
              content="Find, compare, and connect with wedding vendors. Get quotes, schedule meetings, and make informed decisions."
            >
              <Link href="/dashboard/vendors">
                <Card className="bg-[#E8EDE7] hover:bg-[#DFE5DE] transition-colors border-sage-200 h-[140px]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-sage-200/50">
                    <CardTitle className="text-lg font-semibold text-[#4A5D4E]">Vendors</CardTitle>
                    <Store className="h-5 w-5 text-[#738678]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Find and compare vendors</p>
                  </CardContent>
                </Card>
              </Link>
            </TutorialTooltip>

            <TutorialTooltip
              step={4}
              currentStep={currentStep}
              onNext={onNext}
              content="Manage all your vendor contracts in one place. Track payments, deadlines, and important terms."
            >
              <Link href="/dashboard/contracts">
                {" "}
                {/* Corrected href */}
                <Card className="bg-[#E8EDE7] hover:bg-[#DFE5DE] transition-colors border-sage-200 h-[140px]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-sage-200/50">
                    <CardTitle className="text-lg font-semibold text-[#4A5D4E]">Contracts</CardTitle>
                    <FileText className="h-5 w-5 text-[#738678]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Track vendor agreements</p>
                  </CardContent>
                </Card>
              </Link>
            </TutorialTooltip>

            <TutorialTooltip
              step={5}
              currentStep={currentStep}
              onNext={onNext}
              content="Keep track of all your important dates and deadlines. Schedule vendor meetings, tastings, and wedding events."
            >
              <Link href="/dashboard/calendar">
                <Card className="bg-[#E8EDE7] hover:bg-[#DFE5DE] transition-colors border-sage-200 h-[140px]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-sage-200/50">
                    <CardTitle className="text-lg font-semibold text-[#4A5D4E]">Calendar</CardTitle>
                    <Calendar className="h-5 w-5 text-[#738678]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Track important dates</p>
                  </CardContent>
                </Card>
              </Link>
            </TutorialTooltip>
          </div>
        </div>
      </div>
    </TutorialProvider>
  )
}

const AssistantOnboardingComplete = () => (
  <Card className="bg-gradient-to-br from-sage-50 to-sage-100 border-sage-200/50">
    <CardContent className="p-4">
      <div className="flex items-center gap-2">
        <AssistantCharacter size="sm" isWaving />
        <div className="flex-1">
          <p className="text-sm text-sage-700">Need help with your planning? I'm here to assist!</p>
          <div className="flex items-center gap-1 mt-1">
            <p className="text-xs text-sage-600">Click the</p>
            <div className="relative w-6 h-6">
              <AssistantCharacter size="sm" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-500"></span>
              </span>
            </div>
            <p className="text-xs text-sage-600">icon anytime you need help!</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

