"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/vendors/file-upload"
import { ComparisonTable } from "@/components/vendors/comparison-table"
import { ComparisonSummary } from "@/components/vendors/comparison-summary"
import { AssistantTooltip } from "@/components/assistant/assistant-tooltip"
import { Download, Upload, Table, Plus, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import React from "react"

export interface VenuePackage {
  id: string
  vendorName: string
  packageName: string
  price: number
  description: string
  includedServices: string[]
  additionalFees: { name: string; amount: number }[]
  terms: string[]
  capacity: {
    minimum: number
    maximum: number
  }
  spaces: {
    ceremony?: boolean
    reception?: boolean
    cocktailHour?: boolean
    outdoorSpace?: boolean
    brideRoom?: boolean
    groomRoom?: boolean
  }
  amenities: string[]
  restrictions: string[]
  parkingCapacity: number
  hours: number
  category: "venue"
}

// Sample venue data
const venues = [
  {
    id: "1",
    name: "Grand Plaza Hotel",
    packages: [
      {
        id: "gp-1",
        vendorName: "Grand Plaza Hotel",
        packageName: "Premium Wedding Package",
        price: 25000,
        description: "Luxury all-inclusive wedding package in our Grand Ballroom",
        includedServices: [
          "Venue Rental (12 hours)",
          "Tables and Chairs",
          "Basic Linens",
          "Setup and Cleanup",
          "Event Coordinator",
          "Security Staff",
          "Lighting Package",
          "Sound System",
        ],
        additionalFees: [
          { name: "Security Deposit", amount: 2000 },
          { name: "Extended Hours", amount: 500 },
          { name: "Valet Parking", amount: 1000 },
        ],
        terms: [
          "50% deposit required",
          "Final payment due 30 days before event",
          "Cancellation policy: 90 days notice",
          "Insurance required",
          "Licensed vendors only",
        ],
        capacity: {
          minimum: 100,
          maximum: 500,
        },
        spaces: {
          ceremony: true,
          reception: true,
          cocktailHour: true,
          outdoorSpace: true,
          brideRoom: true,
          groomRoom: true,
        },
        amenities: [
          "Full Kitchen",
          "Elevator Access",
          "Wheelchair Accessible",
          "Climate Control",
          "Restrooms",
          "Free Wifi",
        ],
        restrictions: ["No open flames", "No confetti", "Music until 11pm", "Approved vendor list"],
        parkingCapacity: 200,
        hours: 12,
        category: "venue" as const,
      },
    ],
  },
  {
    id: "2",
    name: "Rustic Barn Estate",
    packages: [
      {
        id: "rb-1",
        vendorName: "Rustic Barn Estate",
        packageName: "Countryside Wedding",
        price: 12000,
        description: "Charming barn venue with outdoor ceremony space",
        includedServices: [
          "Venue Rental (10 hours)",
          "Farm Tables",
          "Cross-back Chairs",
          "Setup and Cleanup",
          "Day-of Coordinator",
          "Parking Attendant",
        ],
        additionalFees: [
          { name: "Heaters/Fans", amount: 500 },
          { name: "Additional Hours", amount: 400 },
        ],
        terms: ["30% deposit required", "Final payment due 60 days before event", "Weather contingency plan included"],
        capacity: {
          minimum: 50,
          maximum: 200,
        },
        spaces: {
          ceremony: true,
          reception: true,
          cocktailHour: true,
          outdoorSpace: true,
          brideRoom: true,
          groomRoom: false,
        },
        amenities: ["Prep Kitchen", "String Lights", "Fire Pit", "Outdoor Games", "Parking"],
        restrictions: ["No indoor fireworks", "Noise ordinance after 10pm", "Outside catering allowed"],
        parkingCapacity: 100,
        hours: 10,
        category: "venue" as const,
      },
    ],
  },
]

export default function CompareVenuesPage() {
  const [selectedPackages, setSelectedPackages] = useState<VenuePackage[]>([])
  const [showAddManual, setShowAddManual] = useState(false)
  const [newPackage, setNewPackage] = useState<Partial<VenuePackage>>({
    category: "venue",
  })

  const handleFileUpload = async (files: File[]) => {
    // In a real app, this would process the files and extract data
    console.log("Processing files:", files)
  }

  const handleExportComparison = () => {
    // In a real app, this would generate and download a PDF/spreadsheet
    console.log("Exporting comparison")
  }

  const handleAddPackage = () => {
    if (!newPackage.vendorName || !newPackage.packageName || !newPackage.price) return

    const packageToAdd: VenuePackage = {
      id: Date.now().toString(),
      vendorName: newPackage.vendorName,
      packageName: newPackage.packageName,
      price: newPackage.price,
      description: newPackage.description || "",
      includedServices: (newPackage.description || "").split("\n").filter(Boolean),
      additionalFees: [],
      terms: [],
      capacity: {
        minimum: 50,
        maximum: 200,
      },
      spaces: {
        ceremony: false,
        reception: true,
        cocktailHour: false,
        outdoorSpace: false,
        brideRoom: false,
        groomRoom: false,
      },
      amenities: [],
      restrictions: [],
      parkingCapacity: 0,
      hours: 8,
      category: "venue",
    }

    setSelectedPackages((prev) => [...prev, packageToAdd])
    setShowAddManual(false)
    setNewPackage({ category: "venue" })
  }

  const dialogId = React.useId()

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/vendors/venues">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-sage-900">Compare Venues</h1>
              <p className="mt-2 text-sage-600">Compare venue packages and make informed decisions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AssistantTooltip tip="Export your comparison as a PDF or spreadsheet to share with others" side="bottom">
              <Button variant="outline" onClick={handleExportComparison}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </AssistantTooltip>
            <Dialog open={showAddManual} onOpenChange={setShowAddManual}>
              <DialogTrigger asChild>
                <Button className="bg-[#738678] text-white hover:bg-[#738678]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Details Manually
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Venue Package</DialogTitle>
                  <DialogDescription>Manually add a venue's package to compare</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vendorName">Venue Name</Label>
                    <Input
                      id="vendorName"
                      value={newPackage.vendorName || ""}
                      onChange={(e) => setNewPackage((prev) => ({ ...prev, vendorName: e.target.value }))}
                      placeholder="Enter venue name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="packageName">Package Name</Label>
                    <Input
                      id="packageName"
                      value={newPackage.packageName || ""}
                      onChange={(e) => setNewPackage((prev) => ({ ...prev, packageName: e.target.value }))}
                      placeholder="e.g., Premium Wedding Package"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Package Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newPackage.price || ""}
                      onChange={(e) => setNewPackage((prev) => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="Enter package price"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Included Services</Label>
                    <Textarea
                      id="description"
                      value={newPackage.description || ""}
                      onChange={(e) => setNewPackage((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter included services (one per line)"
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button onClick={handleAddPackage}>Add Package</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Venues to Compare</CardTitle>
                  <CardDescription>Choose packages to compare side by side</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {venues.map((venue) => (
                  <Card key={venue.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{venue.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {venue.packages.map((pkg) => (
                          <div key={pkg.id} className="flex items-center gap-2">
                            <Checkbox
                              id={pkg.id}
                              checked={selectedPackages.some((p) => p.id === pkg.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPackages((prev) => [...prev, pkg])
                                } else {
                                  setSelectedPackages((prev) => prev.filter((p) => p.id !== pkg.id))
                                }
                              }}
                            />
                            <label htmlFor={pkg.id} className="text-sm">
                              {pkg.packageName} - ${pkg.price.toLocaleString()}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upload Package Details</CardTitle>
                  <CardDescription>Upload venue proposals or pricing sheets</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <FileUpload onUpload={handleFileUpload} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Package Comparison</CardTitle>
                <CardDescription>Compare venue packages side by side</CardDescription>
              </div>
              <AssistantTooltip tip="Click on any row to see more details about that feature" side="left">
                <Button variant="ghost" size="icon">
                  <Table className="h-4 w-4" />
                </Button>
              </AssistantTooltip>
            </div>
            {selectedPackages.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <ComparisonSummary packages={selectedPackages} />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ComparisonTable packages={selectedPackages} />
          </CardContent>
        </Card>

        {selectedPackages.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="h-12 w-12 text-sage-400 mb-4" />
              <h3 className="text-lg font-medium text-sage-900 mb-2">Select Packages to Compare</h3>
              <p className="text-sage-600 text-center max-w-md mb-6">
                Choose venue packages to compare or upload your own package details
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

