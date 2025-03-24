import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import type { BudgetData } from "@/types/budget";

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface BudgetAssistantProps {
  budgetData: BudgetData;
  onUpdateBudget?: (updates: Partial<BudgetData>) => void;
}

// Add typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 p-4 bg-sage-50 rounded-lg max-w-[80%]">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

export function BudgetAssistant({ budgetData, onUpdateBudget }: BudgetAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your budget assistant. I can help you understand your budget breakdown, suggest ways to optimize costs, or answer any questions about wedding budgeting. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Optimize the payload by only sending necessary data
      const relevantBudgetData = {
        totalBudget: budgetData.totalBudget,
        guestCount: budgetData.guestCount,
        location: budgetData.location,
        categories: budgetData.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          estimatedCost: cat.estimatedCost,
          percentage: cat.percentage
        }))
      };

      // Only send the last 5 messages for context
      const recentMessages = messages.slice(-5);

      const response = await fetch('/api/budget-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          budgetData: relevantBudgetData,
          conversationHistory: recentMessages
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }]);

      if (data.budgetUpdates && onUpdateBudget) {
        onUpdateBudget(data.budgetUpdates);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-sage-600 hover:bg-sage-700"
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] shadow-xl flex flex-col">
          <div className="p-4 border-b bg-sage-50">
            <h3 className="font-semibold text-sage-900">Budget Assistant</h3>
            <p className="text-sm text-sage-600">Ask me anything about your wedding budget</p>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'assistant'
                        ? 'bg-sage-50 text-sage-900'
                        : 'bg-sage-600 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">
                      {message.content.split('•').map((part, i) => 
                        i === 0 ? part : (
                          <React.Fragment key={i}>
                            <br />
                            <span className="inline-block">
                              • {part}
                            </span>
                          </React.Fragment>
                        )
                      )}
                    </p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </>
  );
} 