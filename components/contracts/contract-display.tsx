"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { CalendarPlus, CheckCircle2, ChevronDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Contract {
  id: string
  vendor: string
  category: string
  paymentSchedule: { type: string; amount: number; dueDate: string; status: "paid" | "unpaid" }[]
  includedServices: string[]
  keyExclusions: string[]
  events: { name: string; date: string; time: string; addedToCalendar: boolean }[]
}

interface ContractDisplayProps {
  contract: Contract
  onAddToCalendar: (contractId: string, eventName: string) => void
}

export function ContractDisplay({ contract, onAddToCalendar }: ContractDisplayProps) {
  const [showAddEventDialog, setShowAddEventDialog] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<{ contractId: string; eventName: string } | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAddEventToCalendar = () => {
    if (currentEvent) {
      onAddToCalendar(currentEvent.contractId, currentEvent.eventName)
      setCurrentEvent(null)
      setShowAddEventDialog(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <Card key={contract.id} className="border-b border-sage-200 mb-6 border-2 border-[#738678]">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-sage-900 flex items-center justify-between">
          {contract.vendor} ({contract.category})
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Hide Details" : "See Details"}
            <ChevronDown
              className="ml-2 h-4 w-4 transition-transform duration-200"
              style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}
            />
          </Button>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            {/* Payment Schedule Table */}
            <div>
              <h4 className="font-medium text-sage-700">Payment Schedule</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Add to Calendar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contract.paymentSchedule.map((payment) => (
                    <TableRow key={payment.type}>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "paid" ? "default" : "outline"}>{payment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="icon" className="ml-2">
                          <CalendarPlus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Included Services */}
            <div>
              <h4 className="font-medium text-sage-700">Included Services</h4>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {contract.includedServices.map((service) => (
                  <li key={service} className="text-sm text-sage-600">
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Exclusions */}
            {contract.keyExclusions.length > 0 && (
              <div>
                <h4 className="font-medium text-sage-700">Key Exclusions</h4>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  {contract.keyExclusions.map((exclusion) => (
                    <li key={exclusion} className="text-sm text-sage-600">
                      {exclusion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Events */}
            <div>
              <h4 className="font-medium text-sage-700">Events</h4>
              <ul className="mt-2 space-y-1">
                {contract.events.map((event) => (
                  <li key={event.name} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{event.name}:</span>{" "}
                      <span>
                        {event.date} at {event.time}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentEvent({ contractId: contract.id, eventName: event.name })
                        setShowAddEventDialog(true)
                      }}
                    >
                      {event.addedToCalendar ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <CalendarPlus className="h-4 w-4" />
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Event to Calendar</DialogTitle>
                  <DialogDescription>
                    Confirm you would like to add {currentEvent?.eventName} to your calendar.
                  </DialogDescription>
                </DialogHeader>
                <div className="pt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddEventDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEventToCalendar}>Confirm</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

