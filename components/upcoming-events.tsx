import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from 'lucide-react'

export function UpcomingEvents() {
  return (
    <Card className="bg-gradient-to-br from-[#E8EDE7] to-[#DFE5DE] border-sage-200/50 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-sage-100/90 to-sage-50/80">
            <CalendarDays className="h-4 w-4 text-sage-700" />
          </div>
          <CardTitle className="text-base text-[#4A5D4E]">Upcoming Events</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="rounded-lg bg-white/80 p-2 backdrop-blur-sm border border-sage-200">
          <div className="font-medium text-sm text-[#4A5D4E]">Venue Final Payment</div>
          <div className="text-xs text-sage-600">Due May 15, 2025</div>
        </div>
        <div className="rounded-lg bg-white/80 p-2 backdrop-blur-sm border border-sage-200">
          <div className="font-medium text-sm text-[#4A5D4E]">Cake Tasting</div>
          <div className="text-xs text-sage-600">February 20, 2025 at 2 PM</div>
        </div>
      </CardContent>
    </Card>
  )
}

