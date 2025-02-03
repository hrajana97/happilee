"use client"

import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  
  // Add dummy data for demonstration
  const datesWithEvents = [
    new Date(), // Today
    new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
    new Date(new Date().setDate(new Date().getDate() + 7)), // Week from now
    new Date(new Date().setDate(new Date().getDate() + 14)), // Two weeks from now
    new Date(new Date().setDate(new Date().getDate() + 20)), // 20 days from now
  ]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
      </div>
      <div className="hidden md:block">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
    </div>
  )
} 