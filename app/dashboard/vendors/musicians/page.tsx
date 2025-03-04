"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Instagram, Mail, Plus, Star, MapPin, DollarSign, SlidersHorizontal, Music, ArrowLeft } from "lucide-react"
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
import { QuoteTemplateDialog } from "@/components/vendors/quote-template-dialog"
import { storage } from "@/lib/storage"
import { useRouter } from "next/navigation"
import Link from "next/link"
import React from "react"

interface Musician {
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
  type: "DJ" | "Band" | "Solo" | "Duo" | "Orchestra"
  genre: string[]
  equipment: string[]
  hours: number
}

const musicians: Musician[] = [
  {
    id: "1",
    name: "Groove Masters Entertainment",
    instagram: "@groovemasters",
    location: "Downtown",
    pricing: "$$$",
    priceRange: [2500, 4000],
    rating: 4.8,
    reviews: 156,
    contacted: true,
    booked: false,
    lastContact: "2024-01-05",
    emailThread: 2,
    type: "DJ",
    genre: ["Pop", "Hip Hop", "R&B"],
    equipment: ["Professional Sound System", "Lighting Package", "Wireless Mics"],
    hours: 6,
  },
  {
    id: "2",
    name: "The Wedding Band Co.",
    instagram: "@weddingbandco",
    location: "Westside",
    pricing: "$$$$",
    priceRange: [5000, 8000],
    rating: 4.9,
    reviews: 89,
    contacted: false,
    booked: false,
    type: "Band",
    genre: ["Jazz", "Pop", "Rock"],
    equipment: ["Full Band Setup", "Sound System", "Stage Lighting"],
    hours: 4,
  },
  {
    id: "3",
    name: "Classical Strings Ensemble",
    instagram: "@classicalstrings",
    location: "Eastside",
    pricing: "$$",
    priceRange: [1500, 2500],
    rating: 5.0,
    reviews: 64,
    contacted: true,
    booked: false,
    lastContact: "2024-01-12",
    emailThread: 1,
    type: "Orchestra",
    genre: ["Classical", "Contemporary"],
    equipment: ["Acoustic Instruments", "Small PA System"],
    hours: 3,
  },
  {
    id: "4",
    name: "Mix Master Events",
    instagram: "@mixmasterevents",
    location: "Suburbs",
    pricing: "$$",
    priceRange: [1800, 3000],
    rating: 4.7,
    reviews: 93,
    contacted: false,
    booked: false,
    type: "DJ",
    genre: ["EDM", "Top 40", "Latin"],
    equipment: ["Digital DJ Setup", "Dance Floor Lighting", "Fog Machine"],
    hours: 5,
  },
]

const locations = Array.from(new Set(musicians.map((m) => m.location)))
const types = ["DJ", "Band", "Solo", "Duo", "Orchestra"]
const genres = Array.from(new Set(musicians.flatMap((m) => m.genre)))

type SortOption = "rating" | "price-low" | "price-high" | "reviews"

export default function MusiciansPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddVendor, setShowAddVendor] = useState(false)
  const [showAIContact, setShowAIContact] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Musician | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sortBy, setSortBy] = useState<SortOption>("rating")

  const filteredMusicians = useMemo(() => {
    const filtered = musicians.filter((musician) => {
      const matchesSearch =
        musician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        musician.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLocation = selectedLocation === "all" || musician.location === selectedLocation
      const matchesType = selectedType === "all" || musician.type === selectedType
      const matchesGenre = selectedGenre === "all" || musician.genre.includes(selectedGenre)
      const matchesPrice = musician.priceRange[0] >= priceRange[0] && musician.priceRange[1] <= priceRange[1]

      return matchesSearch && matchesLocation && matchesType && matchesGenre && matchesPrice
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
  }, [searchQuery, selectedLocation, selectedType, selectedGenre, priceRange, sortBy])

  const handleContactMusician = (musician: Musician) => {
    setSelectedVendor(musician)
    setShowQuoteDialog(true)
  }

  const getSummaryText = () => {
    const count = filteredMusicians.length
    const priceRangeText = `$${priceRange[0].toLocaleString()} - $${priceRange[1].toLocaleString()}`
    const locationText = selectedLocation === "all" ? "any location" : selectedLocation
    const typeText = selectedType === "all" ? "all types" : selectedType
    const genreText = selectedGenre === "all" ? "all genres" : selectedGenre
    const sortText = {
      rating: "highest rated",
      "price-low": "lowest price",
      "price-high": "highest price",
      reviews: "most reviewed",
    }[sortBy]

    return `Showing ${count} musician${count !== 1 ? "s" : ""} in ${locationText}, ${typeText} playing ${genreText}, 
    within ${priceRangeText}, sorted by ${sortText}.`
  }

  const handleLogout = () => {
    // Add your logout logic here
  }

  const dialogId = React.useId()

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
              <h1 className="text-2xl font-semibold text-sage-900">Musicians & DJs</h1>
              <p className="mt-2 text-sage-600">{getSummaryText()}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Dialog open={showFilters} onOpenChange={setShowFilters}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filter Musicians</DialogTitle>
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
                    <Label>Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {types.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Genre</Label>
                    <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genres</SelectItem>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
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
            <Button variant="outline" asChild>
              <Link href="/dashboard/vendors/musicians/compare">Compare Musicians</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedVendor(null)
                setShowQuoteDialog(true)
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Quote Request Template
            </Button>
            <Dialog open={showAddVendor} onOpenChange={setShowAddVendor}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Musician
                </Button>
              </DialogTrigger>
              <DialogContent aria-describedby={`${dialogId}-desc`}>
                <DialogHeader>
                  <DialogTitle>Add New Musician</DialogTitle>
                  <DialogDescription id={`${dialogId}-desc`}>
                    Add a musician or band you've found to keep track of all your options.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter name or band name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instagram">Instagram Handle</Label>
                    <Input id="instagram" placeholder="@handle" />
                  </div>
                  <Button className="w-full" onClick={() => setShowAddVendor(false)}>
                    Add Musician
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Search musicians..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <div className="flex items-center gap-2">
            <Label>Sort by:</Label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="reviews">Number of Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="contacted">Contacted</TabsTrigger>
            <TabsTrigger value="not-contacted">Not Contacted</TabsTrigger>
            <TabsTrigger value="booked">Booked</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredMusicians.map((musician) => (
              <MusicianCard key={musician.id} musician={musician} onContact={handleContactMusician} />
            ))}
          </TabsContent>

          <TabsContent value="contacted" className="space-y-6">
            {filteredMusicians
              .filter((m) => m.contacted)
              .map((musician) => (
                <MusicianCard key={musician.id} musician={musician} onContact={handleContactMusician} />
              ))}
          </TabsContent>

          <TabsContent value="not-contacted" className="space-y-6">
            {filteredMusicians
              .filter((m) => !m.contacted)
              .map((musician) => (
                <MusicianCard key={musician.id} musician={musician} onContact={handleContactMusician} />
              ))}
          </TabsContent>

          <TabsContent value="booked" className="space-y-6">
            {filteredMusicians
              .filter((m) => m.booked)
              .map((musician) => (
                <MusicianCard key={musician.id} musician={musician} onContact={handleContactMusician} />
              ))}
          </TabsContent>
        </Tabs>

        {selectedVendor && (
          <AIContactDialog
            open={showAIContact}
            onOpenChange={setShowAIContact}
            vendor={{
              name: selectedVendor.name,
              category: selectedVendor.type,
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
            name: selectedVendor?.name || "[Vendor Name]",
            category: "Musician",
          }}
          onSaveTemplate={(template) => {
            localStorage.setItem("musician_quote_template", template)
          }}
        />
      </div>
    </div>
  )
}

interface MusicianCardProps {
  musician: Musician
  onContact: (musician: Musician) => void
}

function MusicianCard({ musician, onContact }: MusicianCardProps) {
  return (
    <Card key={musician.id} className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xl font-semibold">
            {musician.name}
            {musician.booked && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Booked
              </span>
            )}
          </CardTitle>
          <CardDescription className="flex items-center gap-4 mt-1">
            <span className="flex items-center">
              <Music className="h-4 w-4 mr-1" />
              {musician.type}
            </span>
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {musician.location}
            </span>
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {musician.pricing} (${musician.priceRange[0].toLocaleString()} - $
              {musician.priceRange[1].toLocaleString()})
            </span>
            <span className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              {musician.rating} ({musician.reviews} reviews)
            </span>
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {musician.instagram && (
            <Button variant="outline" size="icon" asChild>
              <a
                href={`https://www.instagram.com/${musician.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button variant={musician.contacted ? "outline" : "default"} onClick={() => onContact(musician)}>
            <Mail className="h-4 w-4 mr-2" />
            {musician.contacted ? "Follow up" : "Contact"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {musician.genre.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-800"
              >
                {genre}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {musician.equipment.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                {item}
              </span>
            ))}
          </div>
          <AICommunicationSummary
            vendorName={musician.name}
            lastContact={musician.lastContact || null}
            emailCount={musician.emailThread}
            status={musician.contacted ? "in_progress" : "not_started"}
            nextStep={musician.contacted ? "Follow up on song list and equipment details" : "Initial contact"}
          />
        </div>
      </CardContent>
    </Card>
  )
}

