"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CalendarPlus, CheckCircle2, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/vendors/file-upload"
import { toast } from "@/components/ui/use-toast"
import { ContractDisplay } from "@/components/contracts/contract-display"
import { AssistantTooltip } from "@/components/assistant/assistant-tooltip"
import Link from "next/link"

// Sample contract data (replace with actual data fetching)
const sampleContracts = [
  {
    id: "1",
    vendor: "Grand Ballroom",
    category: "Venue",
    paymentSchedule: [
      { type: "Deposit", amount: 5000, dueDate: "2024-03-15", status: "paid" },
      { type: "First Payment", amount: 7500, dueDate: "2024-04-15", status: "unpaid" },
      { type: "Second Payment", amount: 7500, dueDate: "2024-05-15", status: "unpaid" },
    ],
    includedServices: ["Venue rental", "Tables and chairs", "Basic linens", "Setup and cleanup"],
    keyExclusions: ["Catering", "Decorations", "DJ"],
    events: [
      { name: "Ceremony", date: "2024-06-15", time: "15:00", addedToCalendar: false },
      { name: "Reception", date: "2024-06-15", time: "17:00", addedToCalendar: false },
    ],
  },
  {
    id: "2",
    vendor: "Elegant Eats Catering",
    category: "Catering",
    paymentSchedule: [
      { type: "Deposit", amount: 2000, dueDate: "2024-03-22", status: "paid" },
      { type: "First Payment", amount: 3000, dueDate: "2024-05-01", status: "unpaid" },
      { type: "Final Payment", amount: 5000, dueDate: "2024-06-01", status: "unpaid" },
    ],
    includedServices: ["Plated dinner", "Dessert", "Beverages", "Service staff"],
    keyExclusions: ["Linens", "Cake", "Bar service"],
    events: [{ name: "Menu Tasting", date: "2024-04-20", time: "12:00", addedToCalendar: false }],
  },
  {
    id: "3",
    vendor: "Capture the Moment Photography",
    category: "Photography",
    paymentSchedule: [
      { type: "Deposit", amount: 1000, dueDate: "2024-04-05", status: "paid" },
      { type: "Final Payment", amount: 2000, dueDate: "2024-06-08", status: "unpaid" },
    ],
    includedServices: ["8 hours of coverage", "Engagement shoot", "Digital photos"],
    keyExclusions: ["Prints", "Photo album", "Videography"],
    events: [
      { name: "Engagement Shoot", date: "2024-05-12", time: "10:00", addedToCalendar: false },
      { name: "Wedding Photos", date: "2024-06-15", time: "10:00", addedToCalendar: false },
    ],
  },
]

export default function ContractsPage() {
  const [contracts, setContracts] = useState(sampleContracts)
  const [showUploadDialog, setShowUploadDialog] = useState(false)

  const handleNewContract = () => {
    setShowUploadDialog(true)
  }

  const handleUpload = (files: File[]) => {
    console.log("Uploaded files:", files)
    // Process uploaded files (e.g., send to backend for analysis)
    setShowUploadDialog(false)
    toast({
      title: "Contract Uploaded",
      description: "Your contract has been successfully uploaded.",
    })
  }

  const handleAddToCalendar = (contractId: string, eventName: string) => {
    setContracts((prevContracts) =>
      prevContracts.map((contract) => {
        if (contract.id === contractId) {
          return {
            ...contract,
            events: contract.events.map((event) =>
              event.name === eventName ? { ...event, addedToCalendar: true } : event,
            ),
          }
        }
        return contract
      }),
    )

    toast({
      title: "Event Added to Calendar",
      description: `${eventName} has been added to your calendar.`,
    })
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Contracts Tool</CardTitle>
                  <CardDescription className="mt-2">
                    Upload and analyze contracts to extract key information, schedule payments, and track events.
                  </CardDescription>
                </div>
                <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={handleNewContract} className="bg-[#738678] hover:bg-[#738678]/90 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Contract
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload New Contract</DialogTitle>
                      <DialogDescription>Supported formats: PDF, DOCX</DialogDescription>{" "}
                      {/* Add more formats as needed */}
                    </DialogHeader>
                    <CardContent>
                      <FileUpload onUpload={handleUpload} />
                    </CardContent>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {contracts.map((contract) => (
              <ContractDisplay key={contract.id} contract={contract} onAddToCalendar={handleAddToCalendar} />
            ))}
          </CardContent>
        </Card>
        <AssistantTooltip />
      </div>
    </div>
  )
}

