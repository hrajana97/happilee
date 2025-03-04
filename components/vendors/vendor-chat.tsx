"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { VendorCategory, Vendor } from "@/app/dashboard/vendors/[categoryId]/page"

type MessageSender = "user" | "vendor"

type Message = {
  id: string
  content: string
  sender: MessageSender
  timestamp: Date
}

type VendorChatProps = {
  category: VendorCategory | null
  vendor: Vendor | null
}

export function VendorChat({ category, vendor }: VendorChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isScheduling, setIsScheduling] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Reset messages when vendor or category changes
  useEffect(() => {
    setMessages([])
    if (vendor) {
      // Add initial vendor message
      setMessages([
        {
          id: "1",
          content: `Welcome! I'm here to help you communicate with ${vendor.name}. What would you like to know?`,
          sender: "vendor",
          timestamp: new Date(),
        },
      ])
    } else if (category) {
      // Add initial category message
      setMessages([
        {
          id: "1",
          content: `Let me help you find the perfect ${category.name.toLowerCase()} for your wedding. What are your requirements?`,
          sender: "vendor",
          timestamp: new Date(),
        },
      ])
    }
  }, [vendor, category])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Math.random().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate AI/vendor response
    const timeoutId = setTimeout(() => {
      const response: Message = {
        id: Math.random().toString(),
        content: generateResponse(userMessage.content, vendor, category),
        sender: vendor ? "vendor" : "vendor",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    }, 1000)

    return () => clearTimeout(timeoutId)
  }

  const generateResponse = (message: string, vendor: Vendor | null, category: VendorCategory | null): string => {
    if (vendor) {
      if (message.toLowerCase().includes("price") || message.toLowerCase().includes("cost")) {
        return `Our pricing starts at ${vendor.pricing}. Would you like to schedule a consultation to discuss your specific needs?`
      }
      if (message.toLowerCase().includes("available") || message.toLowerCase().includes("date")) {
        return `I have availability on the following dates: ${vendor.availability.join(", ")}. Would you like to schedule a meeting?`
      }
      return `Thank you for your message. I'll be happy to help you with that. Would you like to schedule a consultation to discuss further?`
    }

    return `I'm searching for ${category?.name.toLowerCase()} options that match your requirements. Can you tell me more about your preferences?`
  }

  if (!category && !vendor) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-sage-900">Select a Category or Vendor</h3>
            <p className="mt-1 text-sm text-sage-600">Choose a vendor category or specific vendor to start chatting</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader>
        <CardTitle>{vendor ? vendor.name : category?.name}</CardTitle>
        <CardDescription>{vendor ? vendor.description : category?.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-[#738678] text-white"
                    : message.sender === "vendor"
                      ? "bg-sage-100 text-sage-900"
                      : "bg-blue-100 text-blue-900"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-70">{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
          {vendor && vendor.availability && vendor.availability.length > 0 && (
            <Button type="button" variant="outline" onClick={() => setIsScheduling(true)}>
              <Calendar className="h-4 w-4" />
              <span className="sr-only">Schedule appointment</span>
            </Button>
          )}
        </form>
      </CardContent>

      <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
            <DialogDescription>
              Choose a date and time for your appointment with {vendor?.name || "the vendor"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {vendor?.availability.map((date) => (
              <Button
                key={date}
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setIsScheduling(false)
                  // Add user message about scheduling
                  const userMessage: Message = {
                    id: Math.random().toString(),
                    content: `I'd like to schedule an appointment for ${date}`,
                    sender: "user",
                    timestamp: new Date(),
                  }
                  setMessages((prev) => [...prev, userMessage])

                  setTimeout(() => {
                    const response: Message = {
                      id: Math.random().toString(),
                      content: `Great! I've noted your preference for ${date}. I'll confirm this appointment and send you a calendar invite shortly.`,
                      sender: vendor ? "vendor" : "vendor",
                      timestamp: new Date(),
                    }
                    setMessages((prev) => [...prev, response])
                  }, 1000)
                }}
              >
                {date}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

