"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CalendarClock } from "lucide-react"

export default function RoomPage() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">Coming Soon</CardTitle>
          <CardDescription className="text-lg">The chat room feature is currently under development</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mx-auto max-w-md space-y-4">
            <p className="text-muted-foreground">
              We're working hard to bring you a seamless chat experience for coordinating with your vendors and wedding
              party.
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <CalendarClock className="h-5 w-5" />
              <span>Expected launch: Spring 2024</span>
            </div>
          </div>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
            <Button>Notify Me</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

