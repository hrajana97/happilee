"use client"

import { useState } from "react"
import { Search, Star, MapPin, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { VendorCategory, Vendor } from "@/app/dashboard/vendors/[categoryId]/page"

type VendorListProps = {
  category: VendorCategory
  selectedVendor: Vendor | null
  onSelectVendor: (vendor: Vendor) => void
}

const vendors: Record<string, Vendor[]> = {
  musicians: [
    // Music
    {
      id: "3",
      name: "Groove Masters",
      category: "Music",
      location: "City Center",
      pricing: "$$",
      description: "Professional DJ services",
      specialties: ["Wedding DJ", "Live Music", "MC Services"],
      rating: 4.7,
      reviews: 156,
      availability: ["2024-06-15", "2024-06-22", "2024-06-29"],
    },
    {
      id: "4",
      name: "Classical Strings",
      category: "Music",
      location: "Downtown",
      pricing: "$$$",
      description: "Elegant string quartet",
      specialties: ["Classical", "Contemporary", "Ceremony Music"],
      rating: 4.9,
      reviews: 92,
      availability: ["2024-06-01", "2024-06-15", "2024-06-29"],
    },
  ],
  caterers: [
    // Catering
    {
      id: "5",
      name: "Elegant Eats",
      category: "Catering",
      location: "Downtown",
      pricing: "$$$",
      description: "Fine dining catering service",
      specialties: ["Plated Service", "Food Stations", "Bar Service"],
      rating: 4.8,
      reviews: 143,
      availability: ["2024-06-15", "2024-06-22", "2024-06-29"],
    },
    {
      id: "6",
      name: "Global Fusion",
      category: "Catering",
      location: "Westside",
      pricing: "$$$$",
      description: "International cuisine specialists",
      specialties: ["International", "Fusion", "Dietary Options"],
      rating: 4.9,
      reviews: 78,
      availability: ["2024-06-08", "2024-06-15", "2024-06-22"],
    },
  ],
  florists: [
    // Florals
    {
      id: "7",
      name: "Blooming Beauty",
      category: "Florals",
      location: "Downtown",
      pricing: "$$$",
      description: "Luxury wedding florist",
      specialties: ["Bouquets", "Centerpieces", "Arch Design"],
      rating: 5.0,
      reviews: 112,
      availability: ["2024-06-15", "2024-06-22", "2024-06-29"],
    },
    {
      id: "8",
      name: "Garden Dreams",
      category: "Florals",
      location: "Suburbs",
      pricing: "$$",
      description: "Garden-style arrangements",
      specialties: ["Garden Style", "Seasonal", "Local Flowers"],
      rating: 4.7,
      reviews: 95,
      availability: ["2024-06-01", "2024-06-15", "2024-06-29"],
    },
  ],
  transportation: [
    // Transportation
    {
      id: "9",
      name: "Luxury Limos",
      category: "Transportation",
      location: "City Center",
      pricing: "$$$",
      description: "Luxury vehicle fleet",
      specialties: ["Limousines", "Classic Cars", "Party Buses"],
      rating: 4.8,
      reviews: 86,
      availability: ["2024-06-15", "2024-06-22", "2024-06-29"],
    },
    {
      id: "10",
      name: "Elite Transport",
      category: "Transportation",
      location: "Downtown",
      pricing: "$$$$",
      description: "Premium transportation service",
      specialties: ["Luxury Cars", "Coordination", "Guest Shuttle"],
      rating: 4.9,
      reviews: 73,
      availability: ["2024-06-08", "2024-06-15", "2024-06-22"],
    },
  ],
  bakers: [
    // Cake & Desserts
    {
      id: "11",
      name: "Sweet Dreams Bakery",
      category: "Cake & Desserts",
      location: "Downtown",
      pricing: "$$$",
      description: "Custom wedding cake specialist",
      specialties: ["Custom Cakes", "Dessert Tables", "Dietary Options"],
      rating: 4.9,
      reviews: 134,
      availability: ["2024-06-15", "2024-06-22", "2024-06-29"],
    },
    {
      id: "12",
      name: "Artisan Cakes",
      category: "Cake & Desserts",
      location: "Westside",
      pricing: "$$$$",
      description: "Luxury cake design studio",
      specialties: ["Designer Cakes", "French Pastries", "Sugar Art"],
      rating: 5.0,
      reviews: 67,
      availability: ["2024-06-08", "2024-06-15", "2024-06-22"],
    },
  ],
}

export function VendorList({ category, selectedVendor, onSelectVendor }: VendorListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const categoryVendors = vendors[category.id] || []

  const filteredVendors = categoryVendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Vendors</CardTitle>
        <CardDescription>Browse and select vendors in this category</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-400" />
          <Input
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="space-y-2">
          {filteredVendors.map((vendor) => (
            <Button
              key={vendor.id}
              variant={selectedVendor?.id === vendor.id ? "default" : "outline"}
              className="w-full justify-start h-auto py-3"
              onClick={() => onSelectVendor(vendor)}
            >
              <div className="flex flex-col items-start gap-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{vendor.name}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{vendor.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-sage-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{vendor.pricing}</span>
                  </div>
                </div>
              </div>
            </Button>
          ))}

          {filteredVendors.length === 0 && (
            <p className="text-center text-sm text-sage-600 py-4">No vendors found matching your search</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

