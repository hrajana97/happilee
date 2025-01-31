"use client"

import * as React from "react"
import { useState } from "react"
import { Plus, ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { VendorCategoryCard, type VendorCategory } from "@/components/vendors/vendor-category-card"
import Link from "next/link"

const defaultVendorCategories: VendorCategory[] = [
  // 12+ months
  {
    id: "venues",
    name: "Venues",
    type: "venues",
    description: "Wedding venues and reception spaces",
    vendorCount: 15,
    status: "not_started",
    timeline: "12+ months before",
    href: "/dashboard/vendors/venues", // Added href
  },
  {
    id: "photographers",
    name: "Photography",
    type: "photographers",
    description: "Wedding photographers and photo services",
    vendorCount: 12,
    status: "not_started",
    timeline: "12+ months before",
    href: "/dashboard/vendors/custom/photographers",
  },
  {
    id: "videographers",
    name: "Videography",
    type: "videographers",
    description: "Wedding videographers and film services",
    vendorCount: 8,
    status: "not_started",
    timeline: "12+ months before",
    href: "/dashboard/vendors/custom/videographers",
  },
  {
    id: "florists",
    name: "Florals",
    type: "florist", // Corrected type
    description: "Floral arrangements and decorations",
    vendorCount: 12,
    status: "not_started",
    timeline: "8-12 months before",
    href: "/dashboard/vendors/florists", // Added href
  },
  {
    id: "caterers",
    name: "Catering",
    type: "caterer",
    description: "Food and beverage services",
    vendorCount: 18,
    status: "booked",
    timeline: "8-12 months before",
    href: "/dashboard/vendors/caterers", // Added href
  },

  // 6-8 months
  {
    id: "musicians",
    name: "Music & Entertainment",
    type: "musician",
    description: "DJs and live bands",
    vendorCount: 15,
    status: "searching",
    timeline: "6-8 months before",
    href: "/dashboard/vendors/musicians", // Added href
  },
  {
    id: "decor",
    name: "Decor & Rentals",
    type: "custom",
    description: "Event decor, furniture, and rentals",
    vendorCount: 10,
    status: "not_started",
    timeline: "6-8 months before",
    href: "/dashboard/vendors/decor", // Added href
  },

  // 4-6 months
  {
    id: "bakers",
    name: "Cake & Desserts",
    type: "baker",
    description: "Wedding cakes and sweet treats",
    vendorCount: 10,
    status: "not_started",
    timeline: "4-6 months before",
    href: "/dashboard/vendors/bakers", // Added href
  },
  {
    id: "transportation",
    name: "Transportation",
    type: "transport",
    description: "Wedding day transportation",
    vendorCount: 8,
    status: "not_started",
    timeline: "4-6 months before",
    href: "/dashboard/vendors/transportation", // Added href
  },
]

export default function VendorsPage() {
  const [showAddType, setShowAddType] = useState(false)
  const [customVendorName, setCustomVendorName] = useState("")
  const [customVendorDescription, setCustomVendorDescription] = useState("")
  const [customCategories, setCustomCategories] = useState<VendorCategory[]>([])
  const dialogId = React.useId()

  // Combine default and custom categories
  const allCategories = [...defaultVendorCategories, ...customCategories]

  // Group vendors by timeline
  const groupedVendors = allCategories.reduce(
    (acc, vendor) => {
      if (!acc[vendor.timeline]) {
        acc[vendor.timeline] = []
      }
      acc[vendor.timeline].push(vendor)
      return acc
    },
    {} as Record<string, VendorCategory[]>,
  )

  const handleAddCustomVendor = () => {
    if (!customVendorName || !customVendorDescription) return

    const newCategory: VendorCategory = {
      id: `custom-${customVendorName.toLowerCase().replace(/\s+/g, "-")}`,
      name: customVendorName,
      type: "custom",
      description: customVendorDescription,
      vendorCount: 0,
      status: "not_started",
      href: `/dashboard/vendors/custom/${customVendorName.toLowerCase().replace(/\s+/g, "-")}`,
      timeline: "Custom",
    }

    setCustomCategories((prev) => [...prev, newCategory])
    setShowAddType(false)
    setCustomVendorName("")
    setCustomVendorDescription("")
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-8 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-sage-800">Vendor Categories</h1>
            <p className="mt-2 text-sage-600">Browse and manage your wedding vendors</p>
          </div>
          <Dialog open={showAddType} onOpenChange={setShowAddType}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Vendor Type
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={`${dialogId}-desc`}>
              <DialogHeader>
                <DialogTitle>Add Custom Vendor Type</DialogTitle>
                <DialogDescription id={`${dialogId}-desc`}>
                  Create a new vendor category for specialized vendors.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="vendorType">Vendor Type</Label>
                  <Input
                    id="vendorType"
                    placeholder="e.g., Calligrapher"
                    value={customVendorName}
                    onChange={(e) => setCustomVendorName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description"
                    value={customVendorDescription}
                    onChange={(e) => setCustomVendorDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddCustomVendor}>Add Vendor Type</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Alert className="mb-6 bg-gradient-to-r from-sage-50 to-sage-100/70 border-sage-200">
          <AlertCircle className="h-4 w-4 text-sage-700" />
          <AlertDescription className="text-sage-700">
            These are suggested booking timelines. Consider booking earlier for peak season.
          </AlertDescription>
        </Alert>

        {Object.entries(groupedVendors).map(([timeline, vendors]) => (
          <div key={timeline} className="mb-8">
            <h2 className="text-lg font-medium text-sage-700 mb-4 px-2 py-1 bg-sage-100/50 rounded-lg inline-block">
              Book {timeline}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vendors.map((category) => (
                <VendorCategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

