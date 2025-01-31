'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from 'lucide-react'

interface CountdownProps {
  date: string
  className?: string
}

export function WeddingCountdown({ date, className }: CountdownProps) {
  const [daysLeft, setDaysLeft] = useState(0)

  useEffect(() => {
    const calculateDaysLeft = () => {
      const difference = new Date(date).getTime() - new Date().getTime()
      return Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)))
    }

    setDaysLeft(calculateDaysLeft())
    const timer = setInterval(() => {
      setDaysLeft(calculateDaysLeft())
    }, 1000 * 60 * 60) // Update every hour

    return () => clearInterval(timer)
  }, [date])

  return (
    <Card className={`bg-gradient-to-br from-[#E8EDE7] to-[#DFE5DE] border-sage-200/50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-blue-400 animate-pulse" />
            <h3 className="text-sm font-medium text-sage-700">Countdown to Forever</h3>
            <Heart className="h-4 w-4 text-blue-400 animate-pulse" />
          </div>
          <div className="bg-white/80 rounded-lg px-3 py-2 backdrop-blur-sm border border-blue-100">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#4A5D4E] to-[#738678] bg-clip-text text-transparent">
              {daysLeft}
            </div>
            <div className="text-xs text-sage-600">Days until "I do!"</div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

