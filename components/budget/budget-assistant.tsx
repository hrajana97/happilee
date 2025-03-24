"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Loader2, Bot, Settings2 } from "lucide-react";
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

function TypingIndicator() {
  return (
    <div className="flex justify-start my-2">
      <div className="bg-sage-50 rounded-lg p-4 max-w-[80%] flex items-center gap-2">
        <Bot className="h-4 w-4 text-sage-600" />
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-sage-400 rounded-full animate-[bounce_0.8s_infinite]" />
          <span className="w-2 h-2 bg-sage-400 rounded-full animate-[bounce_0.8s_infinite_0.2s]" />
          <span className="w-2 h-2 bg-sage-400 rounded-full animate-[bounce_0.8s_infinite_0.4s]" />
        </div>
      </div>
    </div>
  );
}

export function BudgetAssistant({ budgetData, onUpdateBudget }: BudgetAssistantProps) {
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
  }, [messages]);

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
      // Show typing indicator immediately
      scrollToBottom();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/budget-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          budgetData,
          conversationHistory: messages
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add a small delay before showing the response to ensure typing indicator is visible
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }]);

      if (data.budgetUpdates && onUpdateBudget) {
        onUpdateBudget(data.budgetUpdates);
      }
    } catch (error) {
      let errorMessage = "I'm sorry, I encountered an error. Please try again.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "I apologize, but it's taking longer than expected to process your request. Please try asking a simpler question or break it down into smaller parts.";
        }
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  const renderMessageContent = (content: string) => {
    // First split by bullet points
    const parts = content.split('•');
    
    return (
      <>
        <span 
          dangerouslySetInnerHTML={{ 
            __html: formatText(parts[0]) 
          }} 
        />
        {parts.slice(1).map((part, i) => (
          <React.Fragment key={i}>
            <br />
            <span className="inline-block">
              • <span 
                dangerouslySetInnerHTML={{ 
                  __html: formatText(part) 
                }} 
              />
            </span>
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <Card className="mt-8 border-sage-200/50 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-sage-50 to-sage-100/50 border-b border-sage-200/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-sage-700" />
            <h3 className="font-semibold text-sage-900">Budget Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-sage-600">Powered by AI</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-sage-50/50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-sage-900 mb-2">How to Use the Budget Assistant</h4>
          <ul className="space-y-2 text-sm text-sage-600">
            <li>• Ask questions about your budget breakdown</li>
            <li>• Request changes to category allocations</li>
            <li>• Get money-saving suggestions</li>
            <li>• Compare different options and their costs</li>
          </ul>
        </div>

        <ScrollArea className="h-[300px] rounded-md border bg-white p-4 mb-4">
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
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-sage-600" />
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-line [&_strong]:font-bold [&_em]:italic">
                    {renderMessageContent(message.content)}
                  </div>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "Assistant is typing..." : "Ask a question about your budget..."}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="relative min-w-[40px] transition-all duration-200"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}

