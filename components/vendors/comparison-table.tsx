"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, AlertCircle, DollarSign, Settings2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

export interface ComparisonTableProps {
  packages: Array<{
    id: string
    vendorName: string
    packageName: string
    price: number
    description: string
    includedServices: string[]
    additionalFees: Array<{ name: string; amount: number }>
    terms: string[]
    category: string
    [key: string]: any
  }>
}

type ComparisonCategory = "all" | "price" | "services" | "terms"

// Feature categories and their respective fields
const featureCategories = {
  pricing: {
    label: "Pricing",
    features: ["price", "pricePerPerson", "additionalFees", "minimumGuests"],
  },
  services: {
    label: "Services & Details",
    features: ["includedServices", "staffing", "serviceStyle", "equipment", "hours"],
  },
  terms: {
    label: "Terms & Conditions",
    features: ["terms"],
  },
}

export function ComparisonTable({ packages }: ComparisonTableProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<ComparisonCategory>("all")
  const [selectedFeature, setSelectedFeature] = React.useState<string | null>(null)
  const [showFeatureSelection, setShowFeatureSelection] = React.useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // State for feature selection
  const [selectedFeatures, setSelectedFeatures] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    Object.values(featureCategories).forEach((category) => {
      category.features.forEach((feature) => {
        initial[feature] = true
      })
    })
    return initial
  })

  // Track selected categories
  const [selectedCategories, setSelectedCategories] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    Object.keys(featureCategories).forEach((category) => {
      initial[category] = true
    })
    return initial
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatFeatureName = (feature: string): string => {
    return feature
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  // Handle category selection
  const handleCategorySelection = (category: string, checked: boolean) => {
    setSelectedCategories((prev) => ({ ...prev, [category]: checked }))

    // Update all features in this category
    const newFeatures = { ...selectedFeatures }
    featureCategories[category as keyof typeof featureCategories].features.forEach((feature) => {
      newFeatures[feature] = checked
    })
    setSelectedFeatures(newFeatures)
  }

  // Handle individual feature selection
  const handleFeatureSelection = (feature: string, checked: boolean) => {
    setSelectedFeatures((prev) => ({ ...prev, [feature]: checked }))

    // Check if all features in a category are selected/deselected
    Object.entries(featureCategories).forEach(([categoryKey, category]) => {
      if (category.features.includes(feature)) {
        const allFeatures = category.features
        const allSelected = allFeatures.every((f) => (f === feature ? checked : selectedFeatures[f]))
        setSelectedCategories((prev) => ({ ...prev, [categoryKey]: allSelected }))
      }
    })
  }

  // Select/Deselect all features
  const handleSelectAll = (select: boolean) => {
    const newFeatures: Record<string, boolean> = {}
    const newCategories: Record<string, boolean> = {}

    Object.entries(featureCategories).forEach(([categoryKey, category]) => {
      newCategories[categoryKey] = select
      category.features.forEach((feature) => {
        newFeatures[feature] = select
      })
    })

    setSelectedFeatures(newFeatures)
    setSelectedCategories(newCategories)
  }

  const renderFeatureValue = (pkg: ComparisonTableProps["packages"][0], feature: string): React.ReactNode => {
    if (!pkg || !(feature in pkg)) return "N/A"

    const value = pkg[feature]

    switch (feature) {
      case "price":
        return (
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-sage-400" />
            {formatCurrency(value)}
          </div>
        )
      case "pricePerPerson":
        return value ? `${formatCurrency(value)} per person` : "N/A"
      case "includedServices":
        return Array.isArray(value) && value.length ? (
          <div className="space-y-1">
            {value.map((service, idx) => (
              <Badge key={idx} variant="outline" className="mr-1">
                {service}
              </Badge>
            ))}
          </div>
        ) : (
          "None"
        )
      case "terms":
        return Array.isArray(value) && value.length ? (
          <ul className="list-disc pl-4 space-y-1">
            {value.map((term, idx) => (
              <li key={idx} className="text-sm text-sage-600">
                {term}
              </li>
            ))}
          </ul>
        ) : (
          "None"
        )
      case "additionalFees":
        return Array.isArray(value) && value.length ? (
          <div className="space-y-1">
            {value.map((fee, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-sage-600">{fee.name}</span>
                <span className="text-sm font-medium">{formatCurrency(fee.amount)}</span>
              </div>
            ))}
          </div>
        ) : (
          "None"
        )
      case "serviceStyle":
        return value || "N/A"
      case "equipment":
        if (Array.isArray(value)) {
          return (
            <div className="space-y-1">
              {value.map((item, idx) => (
                <Badge key={idx} variant="outline" className="mr-1">
                  {item}
                </Badge>
              ))}
            </div>
          )
        }
        // Sample equipment data if none provided
        const sampleEquipment = {
          photographer: ["Professional DSLR", "Backup Camera", "Studio Lighting", "Flash Kit", "Prime Lenses"],
          videographer: ["4K Cameras", "Drone", "Stabilizer", "Wireless Mics", "LED Lighting"],
          musician: ["PA System", "Wireless Microphones", "Mixing Board", "Speakers", "LED Dance Lights"],
          venue: ["Tables & Chairs", "Basic Linens", "Sound System", "Lighting Package", "Dance Floor"],
        }
        return pkg.category in sampleEquipment ? (
          <div className="space-y-1">
            {sampleEquipment[pkg.category as keyof typeof sampleEquipment].map((item, idx) => (
              <Badge key={idx} variant="outline" className="mr-1">
                {item}
              </Badge>
            ))}
          </div>
        ) : (
          "None"
        )
      case "staffing":
        if (typeof value === "object" && value !== null) {
          return (
            <div className="space-y-1">
              {Object.entries(value).map(([role, count]) => (
                <div key={role} className="flex justify-between">
                  <span className="text-sm text-sage-600">{formatFeatureName(role)}:</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          )
        }
        return "N/A"
      default:
        if (typeof value === "boolean") {
          return value ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />
        }
        if (Array.isArray(value)) {
          return value.join(", ") || "None"
        }
        return value?.toString() || "N/A"
    }
  }

  const filteredFeatures = Object.entries(featureCategories).flatMap(([_, category]) =>
    category.features.filter((feature) => selectedFeatures[feature]),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={selectedCategory} onValueChange={(value: ComparisonCategory) => setSelectedCategory(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Features</SelectItem>
            <SelectItem value="price">Pricing</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="terms">Terms & Conditions</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => setShowFeatureSelection(true)}>
          <Settings2 className="h-4 w-4 mr-2" />
          Select Features
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : packages.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">FEATURE</TableHead>
                {packages.map((pkg) => (
                  <TableHead key={pkg.id}>
                    <div className="font-medium">
                      {pkg.vendorName}
                      <div className="text-sm font-normal text-sage-600">{pkg.packageName}</div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeatures.map((feature) => (
                <TableRow key={feature}>
                  <TableCell className="font-medium">
                    <Button
                      variant="ghost"
                      className="p-0 h-auto hover:bg-sage-50 rounded-lg px-2 py-1 w-full justify-start text-left"
                      onClick={() => setSelectedFeature(feature)}
                    >
                      {formatFeatureName(feature)}
                    </Button>
                  </TableCell>
                  {packages.map((pkg) => (
                    <TableCell key={`${pkg.id}-${feature}`}>{renderFeatureValue(pkg, feature)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium text-sage-900 mb-2">Select Packages to Compare</h3>
            <p className="text-sage-600 text-center max-w-md mb-6">
              Choose packages to compare side by side to see their features and pricing details.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={selectedFeature !== null} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedFeature ? formatFeatureName(selectedFeature) : ""}</DialogTitle>
            <DialogDescription>Compare this feature across all packages</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="space-y-2">
                <h4 className="font-medium">{pkg.vendorName}</h4>
                <div className="rounded-lg border p-4">
                  {selectedFeature && renderFeatureValue(pkg, selectedFeature)}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeatureSelection} onOpenChange={setShowFeatureSelection}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Features to Compare</DialogTitle>
            <DialogDescription>Choose which features you want to display in the comparison table</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleSelectAll(true)}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSelectAll(false)}>
                Unselect All
              </Button>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {Object.entries(featureCategories).map(([categoryKey, category]) => (
                  <div key={categoryKey} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={categoryKey}
                        checked={selectedCategories[categoryKey]}
                        onCheckedChange={(checked) => handleCategorySelection(categoryKey, checked as boolean)}
                      />
                      <label htmlFor={categoryKey} className="text-sm font-semibold">
                        {category.label}
                      </label>
                    </div>
                    <div className="ml-6 space-y-2">
                      {category.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={feature}
                            checked={selectedFeatures[feature]}
                            onCheckedChange={(checked) => handleFeatureSelection(feature, checked as boolean)}
                          />
                          <label htmlFor={feature} className="text-sm">
                            {formatFeatureName(feature)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

