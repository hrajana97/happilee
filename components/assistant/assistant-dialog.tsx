"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, MessageSquare, Settings2, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AssistantCharacter } from "./assistant-character"
import { AssistantMessage } from "./assistant-message"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  type: "assistant" | "user"
  feedback?: "positive" | "negative"
}

export function AssistantDialog() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(input),
        type: "assistant",
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const generateResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    // Add budget-specific responses
    if (lowerMessage.includes("budget") || lowerMessage.includes("cost") || lowerMessage.includes("money")) {
      if (lowerMessage.includes("adjust") || lowerMessage.includes("change")) {
        return "I can help you adjust your budget allocations. Would you like to modify a specific category or redistribute your entire budget?"
      }
      if (lowerMessage.includes("save") || lowerMessage.includes("reduce")) {
        return "Here are some tips to help you save money:\n1. Consider off-peak wedding dates\n2. Reduce guest count\n3. Choose seasonal flowers\n4. Book vendors early\n5. DIY decorations\nWould you like more specific advice for any category?"
      }
      if (lowerMessage.includes("track") || lowerMessage.includes("manage")) {
        return "I can help you track your wedding expenses. You can view your budget breakdown, payment timeline, and remaining balance in the Budget section. Would you like me to explain how to use these features?"
      }
      return "I can help you with budget planning, tracking expenses, finding ways to save money, and adjusting allocations. What specific aspect of your wedding budget would you like to discuss?"
    }

    // Keep existing response logic
    if (lowerMessage.includes("vendor") || lowerMessage.includes("photographer")) {
      return "You can find and compare vendors in the Vendors tab. Need help with anything specific?"
    }

    if (lowerMessage.includes("date") || lowerMessage.includes("when")) {
      return "You can set or update your wedding date in the Calendar section. Want me to show you how?"
    }

    return "I'm here to help! Feel free to ask about vendors, budgeting, planning timeline, or any other wedding-related questions."
  }

  const handleFeedback = (messageId: string, type: "positive" | "negative") => {
    setMessages((prev) => prev.map((message) => (message.id === messageId ? { ...message, feedback: type } : message)))
  }

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <AssistantCharacter size="sm" />
          <span className="sr-only">Open Winnie Assistant</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sage-500"></span>
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center gap-4">
              <div>
                <SheetTitle>Winnie the Wedding Wizard</SheetTitle>
                <SheetDescription>I'm here to help with your wedding planning!</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AssistantMessage>
              Hi there! 👋 I'm Winnie, your wedding planning assistant. You can find me in the bottom right corner if
              you need me. I can help you with:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Finding and comparing vendors</li>
                <li>Managing your budget</li>
                <li>Creating your timeline</li>
                <li>And much more!</li>
              </ul>
              What would you like help with today?
            </AssistantMessage>

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-2", message.type === "user" ? "justify-end" : "justify-start")}
              >
                {message.type === "assistant" && <AssistantCharacter size="sm" className="mt-2" />}
                <div className="flex flex-col gap-2 max-w-[80%]">
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2",
                      message.type === "user" ? "bg-sage-600 text-white" : "bg-sage-100",
                    )}
                  >
                    {message.content}
                  </div>
                  {message.type === "assistant" && !message.feedback && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleFeedback(message.id, "positive")}>
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleFeedback(message.id, "negative")}>
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Not helpful
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-6">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about wedding planning..."
                className="flex-1"
              />
              <Button type="submit">
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

