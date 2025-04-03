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
import { CalendarPlus, CalendarClock, MapPin, DollarSign, Camera, Music, Cake, Plus, CheckCircle2, CalendarDays } from "lucide-react"
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

  // Get all event dates for the calendar indicators
  const eventDates = events.map(event => event.date)

  return (
    <ErrorBoundary>
      <div className="p-4">
        <div className="mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-sage-900">Wedding Calendar</h1>
                <p className="mt-2 text-sage-600">Keep track of all your wedding-related dates</p>
              </div>
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

          <div className="grid gap-4 lg:grid-cols-[3fr_1fr]">
            <div className="space-y-4">
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  <Calendar 
                    mode="single" 
                    selected={date} 
                    onSelect={handleDateSelect} 
                    className="rounded-md w-full h-full min-h-[500px]"
                    modifiers={{ hasEvent: eventDates }}
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center text-lg font-semibold",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-sage-600 rounded-md w-[14.28%] font-normal text-sm",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-sage-100/50 [&:has([aria-selected])]:bg-sage-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 h-11 w-[14.28%]",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-sage-100 rounded-md transition-all",
                      day_range_end: "day-range-end",
                      day_selected: "bg-[#738678] text-white hover:bg-[#738678] hover:text-white focus:bg-[#738678] focus:text-white",
                      day_today: "bg-sage-100 text-sage-900",
                      day_outside: "day-outside opacity-50",
                      day_disabled: "text-sage-500 opacity-50",
                      day_hidden: "invisible",
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="px-4 py-3">
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
                <CardContent className="px-4">
                  <div className="grid gap-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-4 rounded-lg border p-4 hover:bg-sage-50 transition-colors">
                        <div className="rounded-full bg-sage-100 p-3">
                          {event.icon ? (
                            <event.icon className="h-5 w-5 text-sage-600" />
                          ) : (
                            <CalendarClock className="h-5 w-5 text-sage-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-medium text-sage-900">{event.title}</h3>
                            <Badge variant={event.type === "payment" ? "destructive" : "secondary"}>{event.type}</Badge>
                          </div>
                          <p className="text-sm text-sage-600 mb-2">{event.date.toLocaleDateString()}</p>
                          {event.location && (
                            <p className="text-sm text-sage-600 flex items-center gap-1 mb-1">
                              <MapPin className="h-4 w-4" /> {event.location}
                            </p>
                          )}
                          {event.amount && (
                            <p className="text-sm text-sage-600 flex items-center gap-1 mb-1">
                              <DollarSign className="h-4 w-4" /> ${event.amount.toLocaleString()}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-sm text-sage-600 mt-2 border-t border-sage-100 pt-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {upcomingEvents.length === 0 && (
                      <div className="text-center py-8 text-sage-600">
                        No events found
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="px-4 py-3">
                  <CardTitle>Event Categories</CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-sage-50">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-2">
                          <CalendarClock className="h-4 w-4 text-blue-600" />
                        </div>
                        <span>Appointments</span>
                      </div>
                      <Badge>{upcomingEvents.filter(e => e.type === "appointment").length}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-sage-50">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-red-100 p-2">
                          <DollarSign className="h-4 w-4 text-red-600" />
                        </div>
                        <span>Payments</span>
                      </div>
                      <Badge>{upcomingEvents.filter(e => e.type === "payment").length}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-sage-50">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-yellow-100 p-2">
                          <CheckCircle2 className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span>Tasks</span>
                      </div>
                      <Badge>{upcomingEvents.filter(e => e.type === "task").length}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-sage-50">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-purple-100 p-2">
                          <CalendarDays className="h-4 w-4 text-purple-600" />
                        </div>
                        <span>Deadlines</span>
                      </div>
                      <Badge>{upcomingEvents.filter(e => e.type === "deadline").length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="px-4 py-3">
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-sage-600">Events This Month</p>
                      <p className="text-2xl font-semibold text-sage-900">
                        {upcomingEvents.filter(e => {
                          const now = new Date()
                          return e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear()
                        }).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-sage-600">Upcoming Payments</p>
                      <p className="text-2xl font-semibold text-sage-900">
                        ${upcomingEvents
                          .filter(e => e.type === "payment")
                          .reduce((sum, e) => sum + (e.amount || 0), 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-sage-600">Next Event</p>
                      <p className="text-lg font-medium text-sage-900">
                        {upcomingEvents.length > 0 ? upcomingEvents[0].title : "No upcoming events"}
                      </p>
                      {upcomingEvents.length > 0 && (
                        <p className="text-sm text-sage-600">
                          {upcomingEvents[0].date.toLocaleDateString()}
                        </p>
                      )}
                    </div>
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

