"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Instagram, Mail, Plus, Star, MapPin, DollarSign, SlidersHorizontal, Flower2, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AICommunicationSummary } from "@/components/vendors/ai-communication-summary"
import { AIContactDialog } from "@/components/vendors/ai-contact-dialog"
import { storage } from "@/lib/storage"
import { useRouter } from "next/navigation"

interface Florist {
  id: string
  name: string
  instagram?: string
  location: string
  pricing: string
  priceRange: [number, number]
  rating: number
  reviews: number
  contacted: boolean
  booked: boolean
  lastContact?: string
  emailThread?: number
  style: string[]
  services: string[]
  specialties: string[]
  minimumOrder: number
}

const florists: Florist[] = [
  {
    id: "1",
    name: "Blooming Beauty Florals",
    instagram: "@bloomingbeauty",
    location: "Downtown",
    pricing: "$$$",
    priceRange: [3000, 6000],
    rating: 4.8,
    reviews: 156,
    contacted: true,
    booked: false,
    lastContact: "2024-01-05",
    emailThread: 2,
    style: ["Modern", "Romantic", "Garden"],
    services: ["Ceremony Flowers", "Reception Decor", "Bridal Party Flowers"],
    specialties: ["Arch Design", "Suspended Installations", "Large-Scale Arrangements"],
    minimumOrder: 2500,
  },
  {
    id: "2",
    name: "Garden Dreams Design",
    instagram: "@gardenddreams",
    location: "Westside",
    pricing: "$$$$",
    priceRange: [5000, 10000],
    rating: 4.9,
    reviews: 89,
    contacted: false,
    booked: false,
    style: ["Luxury", "European", "Classic"],
    services: ["Full Service Design", "Lighting Design", "Event Styling"],
    specialties: ["Luxury Weddings", "Custom Installations", "Premium Flowers"],
    minimumOrder: 5000,
  },
  {
    id: "3",
    name: "Wildflower Studio",
    instagram: "@wildflowerstudio",
    location: "Eastside",
    pricing: "$$",
    priceRange: [1500, 3500],
    rating: 5.0,
    reviews: 64,
    contacted: true,
    booked: false,
    lastContact: "2024-01-12",
    emailThread: 1,
    style: ["Bohemian", "Organic", "Natural"],
    services: ["A la Carte Flowers", "DIY Packages", "Seasonal Arrangements"],
    specialties: ["Local Flowers", "Sustainable Practices", "Wild-Gathered"],
    minimumOrder: 1000,
  },
  {
    id: "4",
    name: "Elegant Petals & Events",
    instagram: "@elegantpetals",
    location: "Suburbs",
    pricing: "$$$",
    priceRange: [2500, 5000],
    rating: 4.7,
    reviews: 93,
    contacted: false,
    booked: false,
    style: ["Traditional", "Elegant", "Contemporary"],
    services: ["Full Service Florals", "Decor Rental", "Day-Of Styling"],
    specialties: ["Centerpieces", "Bouquets", "Church Decorations"],
    minimumOrder: 2000,
  },
]

const locations = Array.from(new Set(florists.map((f) => f.location)))
const styles = Array.from(new Set(florists.flatMap((f) => f.style)))
const services = Array.from(new Set(florists.flatMap((f) => f.services)))

type SortOption = "rating" | "price-low" | "price-high" | "reviews"

export default function FloristsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddVendor, setShowAddVendor] = useState(false)
  const [showAIContact, setShowAIContact] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Florist | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [handleLogout] = useState(false)

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedStyle, setSelectedStyle] = useState<string>("all")
  const [selectedService, setSelectedService] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sortBy, setSortBy] = useState<SortOption>("rating")

  const filteredFlorists = useMemo(() => {
    const filtered = florists.filter((florist) => {
      const matchesSearch =
        florist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        florist.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLocation = selectedLocation === "all" || florist.location === selectedLocation
      const matchesStyle = selectedStyle === "all" || florist.style.includes(selectedStyle)
      const matchesService = selectedService === "all" || florist.services.includes(selectedService)
      const matchesPrice = florist.priceRange[0] >= priceRange[0] && florist.priceRange[1] <= priceRange[1]

      return matchesSearch && matchesLocation && matchesStyle && matchesService && matchesPrice
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price-low":
          return a.priceRange[0] - b.priceRange[0]
        case "price-high":
          return b.priceRange[0] - a.priceRange[0]
        case "reviews":
          return b.reviews - a.reviews
        default:
          return 0
      }
    })
  }, [searchQuery, selectedLocation, selectedStyle, selectedService, priceRange, sortBy])

  const handleContactFlorist = (florist: Florist) => {
    setSelectedVendor(florist)
    setShowAIContact(true)
  }

  const getSummaryText = () => {
    const count = filteredFlorists.length
    const priceRangeText = `$${priceRange[0].toLocaleString()} - $${priceRange[1].toLocaleString()}`
    const locationText = selectedLocation === "all" ? "any location" : selectedLocation
    const styleText = selectedStyle === "all" ? "all styles" : selectedStyle
    const serviceText = selectedService === "all" ? "all services" : selectedService
    const sortText = {
      rating: "highest rated",
      "price-low": "lowest price",
      "price-high": "highest price",
      reviews: "most reviewed",
    }[sortBy]

    return `Showing ${count} florist${count !== 1 ? "s" : ""} in ${locationText}, specializing in ${styleText} with ${serviceText}, 
    within ${priceRangeText}, sorted by ${sortText}.`
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/vendors">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-semibold text-sage-900">Wedding Florists & Decor</h1>
            </div>
            <p className="mt-2 text-sage-600">Find and manage your wedding florals and decorations</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/dashboard/vendors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/vendors/compare?category=florists">Compare Florists</Link>
            </Button>
            <Dialog open={showFilters} onOpenChange={setShowFilters}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter Florists</DialogTitle>
                  <DialogDescription>Refine your search with specific criteria</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Location</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Style</Label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Styles</SelectItem>
                        {styles.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Service Type</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Price Range</Label>
                    <div className="pt-4 px-2">
                      <Slider
                        value={priceRange}
                        min={0}
                        max={10000}
                        step={500}
                        onValueChange={(value: number[]) => setPriceRange([value[0], value[1]])}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-sage-600">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Sort By</Label>
                    <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="reviews">Most Reviews</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showAddVendor} onOpenChange={setShowAddVendor}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Florist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Florist</DialogTitle>
                  <DialogDescription>Add a florist or decor company you've found</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input id="name" placeholder="Enter company name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instagram">Instagram Handle</Label>
                    <Input id="instagram" placeholder="@handle" />
                  </div>
                  <Button className="w-full" onClick={() => setShowAddVendor(false)}>
                    Add Florist
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <Input
            placeholder="Search florists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <p className="text-sm text-sage-600">{getSummaryText()}</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="contacted">Contacted</TabsTrigger>
            <TabsTrigger value="not-contacted">Not Contacted</TabsTrigger>
            <TabsTrigger value="booked">Booked</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredFlorists.map((florist) => (
              <FloristCard key={florist.id} florist={florist} onContact={handleContactFlorist} />
            ))}
          </TabsContent>

          <TabsContent value="contacted" className="space-y-6">
            {filteredFlorists
              .filter((f) => f.contacted)
              .map((florist) => (
                <FloristCard key={florist.id} florist={florist} onContact={handleContactFlorist} />
              ))}
          </TabsContent>

          <TabsContent value="not-contacted" className="space-y-6">
            {filteredFlorists
              .filter((f) => !f.contacted)
              .map((florist) => (
                <FloristCard key={florist.id} florist={florist} onContact={handleContactFlorist} />
              ))}
          </TabsContent>

          <TabsContent value="booked" className="space-y-6">
            {filteredFlorists
              .filter((f) => f.booked)
              .map((florist) => (
                <FloristCard key={florist.id} florist={florist} onContact={handleContactFlorist} />
              ))}
          </TabsContent>
        </Tabs>

        {selectedVendor && (
          <AIContactDialog
            open={showAIContact}
            onOpenChange={setShowAIContact}
            vendor={{
              name: selectedVendor.name,
              category: "Florals",
            }}
            userData={{
              name: storage.getUserData().name || "Guest",
              weddingDate: storage.getUserData().weddingDate || "2024-06-15",
              location: selectedVendor.location,
            }}
          />
        )}
      </div>
    </div>
  )
}

interface FloristCardProps {
  florist: Florist
  onContact: (florist: Florist) => void
}

function FloristCard({ florist, onContact }: FloristCardProps) {
  return (
    <Card key={florist.id} className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xl font-semibold">
            {florist.name}
            {florist.booked && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Booked
              </span>
            )}
          </CardTitle>
          <CardDescription className="flex items-center gap-4 mt-1">
            <span className="flex items-center">
              <Flower2 className="h-4 w-4 mr-1" />
              {florist.style[0]}
            </span>
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {florist.location}
            </span>
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {florist.pricing} (${florist.priceRange[0].toLocaleString()} - ${florist.priceRange[1].toLocaleString()})
            </span>
            <span className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              {florist.rating} ({florist.reviews} reviews)
            </span>
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {florist.instagram && (
            <Button variant="outline" size="icon" asChild>
              <a
                href={`https://www.instagram.com/${florist.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button variant={florist.contacted ? "outline" : "default"} onClick={() => onContact(florist)}>
            <Mail className="h-4 w-4 mr-2" />
            {florist.contacted ? "Follow up" : "Contact"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {florist.style.map((style) => (
              <span
                key={style}
                className="inline-flex items-center rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-800"
              >
                {style}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {florist.services.map((service) => (
              <span
                key={service}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                {service}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {florist.specialties.map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
              >
                {specialty}
              </span>
            ))}
          </div>
          <AICommunicationSummary
            vendorName={florist.name}
            lastContact={florist.lastContact}
            emailCount={florist.emailThread}
            status={florist.contacted ? "in_progress" : "not_started"}
            nextStep={florist.contacted ? "Follow up on floral design proposal and pricing details" : "Initial contact"}
          />
        </div>
      </CardContent>
    </Card>
  )
}

