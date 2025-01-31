"use client"

import dynamic from "next/dynamic"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarPlus, CalendarClock, MapPin, DollarSign, Camera, Music, Cake, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ErrorBoundary } from "@/components/error-boundary"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Dynamically import heavy components
const Calendar = dynamic(() => import("@/components/ui/calendar").then((mod) => mod.Calendar), {
  loading: () => (
    <div className="flex items-center justify-center h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
    </div>
  ),
  ssr: false, // Disable SSR for the calendar component
})

interface WeddingEvent {
  id: string
  title: string
  date: Date
  type: "appointment" | "deadline" | "payment" | "task"
  description?: string
  location?: string
  amount?: number
  icon?: any
  synced?: boolean
}

export default function WeddingCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showSync, setShowSync] = useState(false)
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [showDateEvents, setShowDateEvents] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<WeddingEvent>>({
    type: "appointment",
    date: new Date(),
  })
  const [selectedEventType, setSelectedEventType] = useState<string | "all">("all")

  // Calculate dates relative to today
  const today = new Date()
  const inOneWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const inTwoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
  const inOneMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
  const inTwoMonths = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000)
  const inThreeMonths = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)

  const [events, setEvents] = useState<WeddingEvent[]>([
    {
      id: "1",
      title: "Venue Final Payment",
      date: inTwoMonths,
      type: "payment",
      description: "Final payment due to Grand Plaza Hotel",
      amount: 3000,
      icon: DollarSign,
      location: "Grand Plaza Hotel",
    },
    {
      id: "2",
      title: "Cake Tasting",
      date: inOneWeek,
      type: "appointment",
      location: "Sweet Delights Bakery",
      description: "Sample wedding cake flavors and discuss design",
      icon: Cake,
    },
    {
      id: "3",
      title: "Engagement Photo Session",
      date: inTwoWeeks,
      type: "appointment",
      location: "Central Park",
      description: "2-hour photo session with Capture Moments Studio",
      icon: Camera,
    },
    {
      id: "4",
      title: "DJ Meeting",
      date: inOneMonth,
      type: "appointment",
      location: "Groove Masters Studio",
      description: "Discuss music selection and timeline",
      icon: Music,
    },
    {
      id: "5",
      title: "Florist Deposit",
      date: today,
      type: "payment",
      description: "50% deposit for wedding flowers",
      amount: 1500,
      icon: DollarSign,
    },
    {
      id: "6",
      title: "Menu Tasting",
      date: inThreeMonths,
      type: "appointment",
      location: "Elegant Eats Catering",
      description: "Final menu selection and tasting",
      icon: MapPin,
    },
  ])

  const handleCalendarSync = (provider: "google" | "outlook") => {
    // In a real app, this would initiate OAuth flow
    console.log(`Syncing with ${provider} calendar...`)
    setShowSync(false)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setShowDateEvents(true)
    }
  }

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      const event: WeddingEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        date: newEvent.date,
        type: newEvent.type as WeddingEvent["type"],
        description: newEvent.description,
        location: newEvent.location,
        amount: newEvent.amount,
        icon: newEvent.type === "payment" ? DollarSign : CalendarClock,
      }
      setEvents((prev) => [...prev, event])
      setNewEvent({ type: "appointment", date: new Date() })
      setShowNewEvent(false)
    }
  }

  // Get upcoming events sorted by date
  const upcomingEvents = useMemo(() => {
    const filteredEvents = events
      .filter((event) => {
        if (selectedEventType === "all") return true
        return event.type === selectedEventType
      })
      .filter((event) => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
    return filteredEvents
  }, [events, selectedEventType, today])

  // Get events for selected date
  const selectedDateEvents = date ? events.filter((event) => event.date.toDateString() === date.toDateString()) : []

  return (
    <ErrorBoundary>
      <div className="p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-sage-900">Wedding Calendar</h1>
              <p className="mt-2 text-sage-600">Keep track of all your wedding-related dates</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={showSync} onOpenChange={setShowSync}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <CalendarClock className="mr-2 h-4 w-4" />
                    Sync Status
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Calendar Sync Status</DialogTitle>
                    <DialogDescription>Manage your calendar connections</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between">
                      <span>Google Calendar</span>
                      <Button variant="outline" onClick={() => handleCalendarSync("google")}>
                        Connect
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Outlook Calendar</span>
                      <Button variant="outline" onClick={() => handleCalendarSync("outlook")}>
                        Connect
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={showNewEvent} onOpenChange={setShowNewEvent}>
                <DialogTrigger asChild>
                  <Button className="bg-[#738678] hover:bg-[#738678]/90 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    New Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>Create a new wedding-related event</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={newEvent.title || ""}
                        onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Event Type</Label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(value) =>
                          setNewEvent((prev) => ({ ...prev, type: value as WeddingEvent["type"] }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appointment">Appointment</SelectItem>
                          <SelectItem value="deadline">Deadline</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="task">Task</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEvent.date?.toISOString().split("T")[0] || ""}
                        onChange={(e) => setNewEvent((prev) => ({ ...prev, date: new Date(e.target.value) }))}
                      />
                    </div>
                    {newEvent.type === "payment" && (
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newEvent.amount || ""}
                          onChange={(e) => setNewEvent((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                        />
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newEvent.location || ""}
                        onChange={(e) => setNewEvent((prev) => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description || ""}
                        onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddEvent}>Add Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <Card>
              <CardContent className="p-6">
                <Calendar mode="single" selected={date} onSelect={handleDateSelect} className="rounded-md border" />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Events</CardTitle>
                    <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="appointment">Appointments</SelectItem>
                        <SelectItem value="deadline">Deadlines</SelectItem>
                        <SelectItem value="payment">Payments</SelectItem>
                        <SelectItem value="task">Tasks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-4 rounded-lg border p-4">
                        <div className="rounded-full bg-sage-100 p-2">
                          {event.icon ? (
                            <event.icon className="h-4 w-4 text-sage-600" />
                          ) : (
                            <CalendarClock className="h-4 w-4 text-sage-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge variant={event.type === "payment" ? "destructive" : "secondary"}>{event.type}</Badge>
                          </div>
                          <p className="text-sm text-sage-600">{event.date.toLocaleDateString()}</p>
                          {event.location && (
                            <p className="text-sm text-sage-600 flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" /> {event.location}
                            </p>
                          )}
                          {event.amount && (
                            <p className="text-sm text-sage-600 flex items-center gap-1 mt-1">
                              <DollarSign className="h-3 w-3" /> ${event.amount.toLocaleString()}
                            </p>
                          )}
                          {event.description && <p className="text-sm text-sage-600 mt-1">{event.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Dialog open={showDateEvents} onOpenChange={setShowDateEvents}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Events on {date?.toLocaleDateString()}</DialogTitle>
                <DialogDescription>
                  {selectedDateEvents.length === 0
                    ? "No events scheduled for this date"
                    : `${selectedDateEvents.length} event(s) scheduled`}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-sage-100 p-2">
                      {event.icon ? (
                        <event.icon className="h-4 w-4 text-sage-600" />
                      ) : (
                        <CalendarClock className="h-4 w-4 text-sage-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge variant={event.type === "payment" ? "destructive" : "secondary"}>{event.type}</Badge>
                      </div>
                      {event.location && (
                        <p className="text-sm text-sage-600 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {event.location}
                        </p>
                      )}
                      {event.amount && (
                        <p className="text-sm text-sage-600 flex items-center gap-1 mt-1">
                          <DollarSign className="h-3 w-3" /> ${event.amount.toLocaleString()}
                        </p>
                      )}
                      {event.description && <p className="text-sm text-sage-600 mt-1">{event.description}</p>}
                    </div>
                  </div>
                ))}
                <DialogFooter>
                  <Button onClick={() => setShowNewEvent(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ErrorBoundary>
  )
}

