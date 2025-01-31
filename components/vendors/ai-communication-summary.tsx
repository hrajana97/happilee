"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Mail, Clock } from "lucide-react"

interface AICommunicationSummaryProps {
  vendorName: string
  lastContact: string | null
  emailCount?: number
  status: "not_started" | "in_progress" | "completed"
  nextStep?: string
}

export function AICommunicationSummary({
  vendorName,
  lastContact,
  emailCount = 0,
  status,
  nextStep,
}: AICommunicationSummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-sage-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5" />
          AI Communication Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-sage-600">{emailCount} emails exchanged</span>
          </div>
          {lastContact && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-sage-600" />
              <span className="text-sm text-sage-600">Last contact: {new Date(lastContact).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Badge variant={status === "completed" ? "default" : status === "in_progress" ? "secondary" : "outline"}>
            {status === "completed"
              ? "Communication Complete"
              : status === "in_progress"
                ? "In Discussion"
                : "Not Started"}
          </Badge>
          {nextStep && (
            <span className="text-sm text-sage-600">
              Next:{" "}
              {status === "completed"
                ? "Schedule final consultation"
                : status === "in_progress"
                  ? "Ask for clarification on package pricing and included services"
                  : "Request pricing information and wedding date availability"}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

