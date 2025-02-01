"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Instagram, Mail, Plus, Star, MapPin, DollarSign, SlidersHorizontal, Users, ArrowLeft } from "lucide-react"
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
import Link from "next/link"
import { AssistantTooltip } from "@/components/assistant/assistant-tooltip"
import { QuoteTemplateDialog } from "@/components/vendors/quote-template-dialog"

interface Venue {
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
  services: string[]
  specialties: string[]
}

const initialVenues: Venue[] = [
  {
    id: "v1",
    name: "Grand Plaza Hotel",
    instagram: "@grandplazaweddings",
    location: "Downtown",
    pricing: "$$$$",
    priceRange: [15000, 25000],
    rating: 4.9,
    reviews: 156,
    contacted: true,
    booked: false,
    lastContact: "2024-01-15",
    emailThread: 3,
    services: ["Ceremony Space", "Reception Hall", "Catering", "Event Planning"],
    specialties: ["Luxury Weddings", "Rooftop Ceremonies", "Grand Ballroom"],
  },
  {
    id: "v2",
    name: "Rustic Barn Estate",
    instagram: "@rusticbarnestate",
    location: "Countryside",
    pricing: "$$",
    priceRange: [5000, 12000],
    rating: 4.7,
    reviews: 89,
    contacted: false,
    booked: false,
    services: ["Indoor/Outdoor Space", "Getting Ready Suites", "Parking"],
    specialties: ["Barn Weddings", "Garden Ceremonies", "Country Reception"],
  },
  {
    id: "v3",
    name: "Oceanview Resort",
    instagram: "@oceanviewweddings",
    location: "Beachfront",
    pricing: "$$$",
    priceRange: [10000, 20000],
    rating: 4.8,
    reviews: 112,
    contacted: true,
    booked: false,
    lastContact: "2024-01-10",
    emailThread: 2,
    services: ["Beach Ceremony", "Ballroom Reception", "Accommodations"],
    specialties: ["Beach Weddings", "Sunset Ceremonies", "Resort Experience"],
  },
  {
    id: "v4",
    name: "Historic Manor House",
    instagram: "@historicmanorweddings",
    location: "Eastside",
    pricing: "$$$",
    priceRange: [8000, 15000],
    rating: 4.6,
    reviews: 78,
    contacted: false,
    booked: false,
    services: ["Indoor Venue", "Gardens", "Bridal Suite"],
    specialties: ["Vintage Weddings", "Garden Parties", "Historic Setting"],
  },
  {
    id: "v5",
    name: "City View Loft",
    instagram: "@cityviewloft",
    location: "Downtown",
    pricing: "$$",
    priceRange: [4000, 8000],
    rating: 4.5,
    reviews: 64,
    contacted: true,
    booked: false,
    lastContact: "2024-01-18",
    emailThread: 1,
    services: ["Loft Space", "Rooftop Access", "Urban Views"],
    specialties: ["Modern Weddings", "Industrial Chic", "Intimate Events"],
  },
  {
    id: "v6",
    name: "Vineyard Estate",
    instagram: "@vineyardweddings",
    location: "Wine Country",
    pricing: "$$$",
    priceRange: [12000, 18000],
    rating: 5.0,
    reviews: 92,
    contacted: false,
    booked: false,
    services: ["Vineyard Ceremony", "Wine Cellar Reception", "Wine Tasting"],
    specialties: ["Winery Weddings", "Outdoor Ceremonies", "Wine Country Experience"],
  },
  {
    id: "v7",
    name: "Mountain Lodge Resort",
    instagram: "@mountainlodgeweddings",
    location: "Mountains",
    pricing: "$$$$",
    priceRange: [18000, 30000],
    rating: 4.9,
    reviews: 103,
    contacted: true,
    booked: false,
    lastContact: "2024-01-12",
    emailThread: 4,
    services: ["Mountain Venue", "Ski Lodge", "Luxury Accommodations"],
    specialties: ["Mountain Weddings", "Winter Ceremonies", "Scenic Views"],
  },
]

const locations = Array.from(new Set(initialVenues.map((v) => v.location)))
const services = Array.from(new Set(initialVenues.flatMap((v) => v.services)))
const specialties = Array.from(new Set(initialVenues.flatMap((v) => v.specialties)))

type SortOption = "rating" | "price-low" | "price-high" | "reviews"

export default function VenuesPage() {
  const router = useRouter()

  const [venues, setVenues] = useState<Venue[]>(initialVenues)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddVenue, setShowAddVenue] = useState(false)
  const [showAIContact, setShowAIContact] = useState(false)

  const [selectedVendor, setSelectedVendor] = useState<Venue | null>(null)

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedService, setSelectedService] = useState<string>("all")

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all")

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000])

  const [sortBy, setSortBy] = useState<SortOption>("rating")

  const [showFilters, setShowFilters] = useState(false)
  const [showQuoteDialog, setShowQuoteDialog] = useState(false) // Add state for quote dialog

  const filteredVenues = useMemo(() => {
    const filtered = venues.filter((venue) => {
      const matchesSearch =
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesLocation = selectedLocation === "all" || venue.location === selectedLocation
      const matchesService = selectedService === "all" || venue.services.includes(selectedService)
      const matchesSpecialty = selectedSpecialty === "all" || venue.specialties.includes(selectedSpecialty)
      const matchesPrice = venue.priceRange[0] >= priceRange[0] && venue.priceRange[1] <= priceRange[1]

      return matchesSearch && matchesLocation && matchesService && matchesSpecialty && matchesPrice
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
  }, [searchQuery, selectedLocation, selectedService, selectedSpecialty, priceRange, sortBy, venues])

  const handleContactVenue = (venue: Venue) => {
    setSelectedVendor(venue)
    setShowAIContact(true)
  }

  const getSummaryText = () => {
    const count = filteredVenues.length
    const priceRangeText = `$${priceRange[0].toLocaleString()} - $${priceRange[1].toLocaleString()}`
    const locationText = selectedLocation === "all" ? "any location" : selectedLocation
    const serviceText = selectedService === "all" ? "all services" : selectedService
    const specialtyText = selectedSpecialty === "all" ? "all specialties" : selectedSpecialty
    const sortText = {
      rating: "highest rated",
      "price-low": "lowest price",
      "price-high": "highest price",
      reviews: "most reviewed",
    }[sortBy]

    return `Showing ${count} venue${count !== 1 ? "s" : ""} in ${locationText} with ${serviceText}, specializing in ${specialtyText}, 
within a price range of ${priceRangeText} sorted by ${sortText}.`
  }

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out")
  }

  const [newVenue, setNewVenue] = useState<Partial<Venue>>({})

  const handleAddVenue = () => {
    if (
      !newVenue.name ||
      !newVenue.location ||
      !newVenue.pricing ||
      !newVenue.priceRange ||
      !newVenue.rating ||
      !newVenue.reviews ||
      !newVenue.services ||
      !newVenue.specialties
    )
      return

    const venueToAdd: Venue = {
      ...newVenue,
      id: Date.now().toString(),
      name: newVenue.name as string,
      location: newVenue.location as string,
      pricing: newVenue.pricing as string,
      priceRange: newVenue.priceRange as [number, number],
      rating: newVenue.rating as number,
      reviews: newVenue.reviews as number,
      contacted: false,
      booked: false,
      services: newVenue.services as string[],
      specialties: newVenue.specialties as string[],
      instagram: newVenue.instagram as string,
    }

    setVenues((prev) => [...prev, venueToAdd])
    setNewVenue({}) // Clear the new venue form after submission
    setShowAddVenue(false)
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-8">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/vendors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-sage-900">Wedding Venues</h1>
              <p className="mt-2 text-sage-600">Find and manage your wedding venues</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Dialog open={showAddVenue} onOpenChange={setShowAddVenue}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Venue
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Venue</DialogTitle>
                  <DialogDescription>Add a venue you&apos;ve found</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Venue Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., The Grand Ballroom"
                      value={newVenue.name || ""}
                      onChange={(e) => setNewVenue((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instagram">Instagram Handle (Optional)</Label>
                    <Input
                      id="instagram"
                      placeholder="e.g., @grandballroom"
                      value={newVenue.instagram || ""}
                      onChange={(e) => setNewVenue((prev) => ({ ...prev, instagram: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, CA"
                      value={newVenue.location || ""}
                      onChange={(e) => setNewVenue((prev) => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="services">Services (comma-separated)</Label>
                    <Input
                      id="services"
                      placeholder="e.g., Ceremony, Reception, Catering"
                      value={(newVenue.services as string[])?.join(", ") || ""}
                      onChange={(e) =>
                        setNewVenue((prev) => ({ ...prev, services: e.target.value.split(",").map((s) => s.trim()) }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                    <Input
                      id="specialties"
                      placeholder="e.g., Outdoor weddings, Barn weddings"
                      value={(newVenue.specialties as string[])?.join(", ") || ""}
                      onChange={(e) =>
                        setNewVenue((prev) => ({
                          ...prev,
                          specialties: e.target.value.split(",").map((s) => s.trim()),
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pricing">Pricing Tier</Label>
                    <Select onValueChange={(value) => setNewVenue((prev) => ({ ...prev, pricing: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Pricing Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="$">$</SelectItem>
                        <SelectItem value="$$">$$</SelectItem>
                        <SelectItem value="$$$">$$$</SelectItem>
                        <SelectItem value="$$$$">$$$$</SelectItem>
                        <SelectItem value="$$$$$">$$$$$</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Price Range</Label>
                    <div className="grid gap-2">
                      <div className="grid gap-2">
                        <Label htmlFor="minPrice">Minimum Price</Label>
                        <Input
                          type="number"
                          id="minPrice"
                          placeholder="Enter minimum price"
                          value={newVenue.priceRange ? newVenue.priceRange[0] : 0}
                          onChange={(e) =>
                            setNewVenue((prev) => ({
                              ...prev,
                              priceRange: prev.priceRange
                                ? [Number.parseInt(e.target.value), prev.priceRange[1]]
                                : undefined,
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="maxPrice">Maximum Price</Label>
                        <Input
                          type="number"
                          id="maxPrice"
                          placeholder="Enter maximum price"
                          value={newVenue.priceRange ? newVenue.priceRange[1] : 30000}
                          onChange={(e) =>
                            setNewVenue((prev) => ({
                              ...prev,
                              priceRange: prev.priceRange
                                ? [prev.priceRange[0], Number.parseInt(e.target.value)]
                                : undefined,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      type="number"
                      id="rating"
                      placeholder="e.g., 4.5"
                      value={newVenue.rating || ""}
                      onChange={(e) => setNewVenue((prev) => ({ ...prev, rating: Number.parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reviews">Number of Reviews</Label>
                    <Input
                      type="number"
                      id="reviews"
                      placeholder="e.g., 150"
                      value={newVenue.reviews || ""}
                      onChange={(e) => setNewVenue((prev) => ({ ...prev, reviews: Number.parseInt(e.target.value) }))}
                    />
                  </div>

                  <Button type="submit" className="w-full" onClick={handleAddVenue}>
                    Add Venue
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <AssistantTooltip
              tip="Compare different venues side by side! Upload pricing sheets or manually enter package details to make informed decisions. Perfect for analyzing costs, capacity, and included services."
            >
              <Button variant="outline" asChild>
                <Link href="/dashboard/vendors/venues/compare">Compare Venues</Link>
              </Button>
            </AssistantTooltip>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedVendor(null)
                setShowQuoteDialog(true)
              }}
              className="bg-[#738678] hover:bg-[#738678]/90 text-white border-0"
            >
              <Mail className="mr-2 h-4 w-4" />
              Quote Request Template
            </Button>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <Input
            placeholder="Search venues..."
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
            {filteredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} onContact={handleContactVenue} />
            ))}
            {filteredVenues.length === 0 && <p>No venues found</p>}
          </TabsContent>

          <TabsContent value="contacted" className="space-y-6">
            {filteredVenues
              .filter((v) => v.contacted)
              .map((venue) => (
                <VenueCard key={venue.id} venue={venue} onContact={handleContactVenue} />
              ))}
          </TabsContent>

          <TabsContent value="not-contacted" className="space-y-6">
            {filteredVenues
              .filter((v) => !v.contacted)
              .map((venue) => (
                <VenueCard key={venue.id} venue={venue} onContact={handleContactVenue} />
              ))}
          </TabsContent>

          <TabsContent value="booked" className="space-y-6">
            {filteredVenues
              .filter((v) => v.booked)
              .map((venue) => (
                <VenueCard key={venue.id} venue={venue} onContact={handleContactVenue} />
              ))}
          </TabsContent>
        </Tabs>

        {selectedVendor && (
          <AIContactDialog
            open={showAIContact}
            onOpenChange={setShowAIContact}
            vendor={{
              name: selectedVendor.name,
              category: "Venue",
            }}
            userData={{
              name: storage.getUserData().name || "Guest",
              weddingDate: storage.getUserData().weddingDate || "2024-06-15",
              location: selectedVendor.location,
            }}
          />
        )}
        <QuoteTemplateDialog
          open={showQuoteDialog}
          onOpenChange={setShowQuoteDialog}
          vendor={{
            name: selectedVendor?.name || "[Venue Name]",
            category: "Venue", // Ensure category is "Venue"
          }}
          onSaveTemplate={(template) => {
            localStorage.setItem("venue_quote_template", template)
          }}
        />
      </div>
    </div>
  )
}

interface VenueCardProps {
  venue: Venue
  onContact: (venue: Venue) => void
}

function VenueCard({ venue, onContact }: VenueCardProps) {
  const handleInstagramClick = (instagram?: string) => {
    if (!instagram) return
    window.open(`https://instagram.com/${instagram.slice(1)}`, "_blank")
  }

  return (
    <Card key={venue.id} className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xl font-semibold">
            {venue.name}
            {venue.booked && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Booked
              </span>
            )}
          </CardTitle>
          <CardDescription className="flex items-center gap-4 mt-1">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {venue.location}
            </span>
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {venue.pricing} (${venue.priceRange[0].toLocaleString()} - ${venue.priceRange[1].toLocaleString()})
            </span>
            <span className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              {venue.rating} ({venue.reviews} reviews)
            </span>
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {venue.instagram && (
            <Button variant="outline" size="icon" onClick={() => handleInstagramClick(venue.instagram)}>
              <Instagram className="h-4 w-4" />
            </Button>
          )}
          <Button variant={venue.contacted ? "outline" : "default"} onClick={() => onContact(venue)}>
            <Mail className="h-4 w-4 mr-2" />
            {venue.contacted ? "Follow up" : "Contact"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {venue.services.map((service) => (
              <span
                key={service}
                className="inline-flex items-center rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-800"
              >
                {service}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {venue.specialties.map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                {specialty}
              </span>
            ))}
          </div>
          <AICommunicationSummary
            vendorName={venue.name}
            lastContact={venue.lastContact || null}
            emailCount={venue.emailThread}
            status={venue.contacted ? "in_progress" : "not_started"}
            nextStep={venue.contacted ? "Follow up on venue availability and pricing details" : "Initial contact"}
          />
        </div>
      </CardContent>
    </Card>
  )
}

