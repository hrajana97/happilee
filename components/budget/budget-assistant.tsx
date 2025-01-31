"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { BudgetCategory, BudgetData } from "@/types/budget"

type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
  action?: {
    type: "merge" | "remove" | "adjust" | "redistribute"
    categoryIds?: string[]
    amount?: number
    distribution?: Record<string, number>
  }
}

interface BudgetAssistantProps {
  budgetData: BudgetData
  onUpdateBudget: (updates: Partial<BudgetData>) => void
}

export function BudgetAssistant({ budgetData, onUpdateBudget }: BudgetAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your budget assistant. I can help you modify your budget categories. For example, you can ask me to merge categories, remove ones you don't need, or adjust allocations.",
      sender: "assistant",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      //This is a placeholder, replace with your actual keyboard shortcut logic
      //Example:  if (event.key === 's' && (event.metaKey || event.ctrlKey)) {
      //            event.preventDefault()
      //            toggleSidebar()
      //          }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (messages.length) {
      scrollToBottom()
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Math.random().toString(),
      content: newMessage,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Process the message and generate a response
    const response = await processMessage(newMessage, budgetData.categories)
    setMessages((prev) => [...prev, response])

    // If there's an action, execute it
    if (response.action) {
      executeAction(response.action)
    }
  }

  const processMessage = async (message: string, categories: BudgetCategory[]): Promise<Message> => {
    const lowerMessage = message.toLowerCase()

    // Check for merge request
    if (lowerMessage.includes("merge") || lowerMessage.includes("combine")) {
      const categoryNames = categories.map((c) => c.name.toLowerCase())
      const foundCategories = categoryNames.filter((name) => lowerMessage.includes(name))

      if (foundCategories.length >= 2) {
        return {
          id: Math.random().toString(),
          content: `I can help you merge these categories. This will combine their budgets into a single category. Would you like to proceed?`,
          sender: "assistant",
          action: {
            type: "merge",
            categoryIds: categories.filter((c) => foundCategories.includes(c.name.toLowerCase())).map((c) => c.id),
          },
        }
      }
    }

    // Check for redistribute request
    if (lowerMessage.includes("redistribute") || lowerMessage.includes("rebalance")) {
      return {
        id: Math.random().toString(),
        content: `I can help redistribute the budget across remaining categories proportionally. Would you like to proceed?`,
        sender: "assistant",
        action: {
          type: "redistribute",
          distribution: calculateProportionalDistribution(categories),
        },
      }
    }

    // Check for adjustment request
    if (lowerMessage.includes("adjust") || lowerMessage.includes("change")) {
      const categoryToAdjust = categories.find((c) => lowerMessage.includes(c.name.toLowerCase()))

      if (categoryToAdjust) {
        const numbers = message.match(/\d+/)
        const amount = numbers ? Number.parseInt(numbers[0]) * 1000 : null

        if (amount) {
          return {
            id: Math.random().toString(),
            content: `I can help you adjust the ${categoryToAdjust.name} budget to $${amount.toLocaleString()}. This will redistribute the difference across other categories. Would you like to proceed?`,
            sender: "assistant",
            action: {
              type: "adjust",
              categoryIds: [categoryToAdjust.id],
              amount,
            },
          }
        }
      }
    }

    // Default response
    return {
      id: Math.random().toString(),
      content:
        "I can help you merge categories, redistribute budgets, or adjust specific category amounts. For example, try asking me to 'merge catering into venue' or 'adjust venue budget to 15000'.",
      sender: "assistant",
    }
  }

  const calculateProportionalDistribution = (categories: BudgetCategory[]): Record<string, number> => {
    const totalBudget = categories.reduce((sum, cat) => sum + cat.estimatedCost, 0)
    const distribution: Record<string, number> = {}

    categories.forEach((category) => {
      distribution[category.id] = Math.round((category.estimatedCost / totalBudget) * 100) / 100
    })

    return distribution
  }

  const executeAction = (action: NonNullable<Message["action"]>) => {
    const updatedCategories = [...budgetData.categories]

    switch (action.type) {
      case "merge":
        if (action.categoryIds && action.categoryIds.length >= 2) {
          const [targetId, ...sourceIds] = action.categoryIds
          const target = updatedCategories.find((c) => c.id === targetId)
          const sources = sourceIds.map((id) => updatedCategories.find((c) => c.id === id)).filter(Boolean)

          if (target && sources.length > 0) {
            // Sum up the estimated and actual costs
            const totalEstimated = sources.reduce((sum, c) => sum + (c?.estimatedCost || 0), target.estimatedCost)
            const totalActual = sources.reduce((sum, c) => sum + (c?.actualCost || 0), target.actualCost)

            // Update target category
            target.estimatedCost = totalEstimated
            target.actualCost = totalActual
            target.remaining = totalEstimated - totalActual
            target.rationale += ` (Including merged categories)`

            // Remove source categories
            const filteredCategories = updatedCategories.filter((c) => !sourceIds.includes(c.id))

            onUpdateBudget({
              categories: filteredCategories,
              lastUpdated: new Date().toISOString(),
            })
          }
        }
        break

      case "redistribute":
        if (action.distribution) {
          const totalBudget = updatedCategories.reduce((sum, cat) => sum + cat.estimatedCost, 0)

          updatedCategories.forEach((category) => {
            const newAmount = Math.round(totalBudget * action.distribution![category.id])
            category.estimatedCost = newAmount
            category.remaining = newAmount - category.actualCost
          })

          onUpdateBudget({
            categories: updatedCategories,
            lastUpdated: new Date().toISOString(),
          })
        }
        break

      case "adjust":
        if (action.categoryIds && action.categoryIds.length === 1 && action.amount) {
          const categoryToAdjust = updatedCategories.find((c) => c.id === action.categoryIds![0])
          if (categoryToAdjust) {
            const difference = action.amount - categoryToAdjust.estimatedCost
            const otherCategories = updatedCategories.filter((c) => c.id !== categoryToAdjust.id)

            // Distribute the difference proportionally among other categories
            const totalOtherBudget = otherCategories.reduce((sum, cat) => sum + cat.estimatedCost, 0)
            otherCategories.forEach((category) => {
              const proportion = category.estimatedCost / totalOtherBudget
              const adjustment = Math.round(difference * proportion)
              category.estimatedCost -= adjustment
              category.remaining = category.estimatedCost - category.actualCost
            })

            // Update the adjusted category
            categoryToAdjust.estimatedCost = action.amount
            categoryToAdjust.remaining = action.amount - categoryToAdjust.actualCost

            onUpdateBudget({
              categories: updatedCategories,
              lastUpdated: new Date().toISOString(),
            })
          }
        }
        break
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Bot className="mr-2 h-4 w-4" />
          Budget Assistant
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Budget Assistant
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col h-[calc(100vh-8rem)]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.action && (
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={() => executeAction(message.action!)}>
                        <Check className="mr-2 h-4 w-4" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setMessages((prev) => [
                            ...prev,
                            {
                              id: Math.random().toString(),
                              content: "No problem! Let me know if you'd like to make any other changes.",
                              sender: "assistant",
                            },
                          ])
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask about modifying your budget..."
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

