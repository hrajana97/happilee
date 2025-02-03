"use client"

import { Form } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { PopoverContent } from "@/components/ui/popover"

export function ScheduleForm() {
  // Dummy data: Some dates in the current and next month
  const datesWithEvents = [
    new Date(), // Today
    new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
    new Date(new Date().setDate(new Date().getDate() + 7)), // Week from now
    new Date(new Date().setDate(new Date().getDate() + 14)), // Two weeks from now
    new Date(new Date().setDate(new Date().getDate() + 20)), // 20 days from now
  ]
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            initialFocus
          />
        </PopoverContent>
      </form>
    </Form>
  )
} 