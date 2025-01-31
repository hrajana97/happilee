"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Instagram,
  Mail,
  Plus,
  Star,
  MapPin,
  DollarSign,
  SlidersHorizontal,
  ArrowLeft,
  ContrastIcon as Compare,
} from "lucide-react"
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
import Link from "next/link"
import { AssistantTooltip } from "@/components/assistant/assistant-tooltip"

interface CustomVendor {
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

const photographers: CustomVendor[] = [
  {
    id: "1",
    name: "Capture Moments Studio",
    instagram: "@capturemoments",
    location: "Downtown",
    pricing: "$$$",
    priceRange: [3000, 5000],
    rating: 4.8,
    reviews: 127,
    contacted: true,
    booked: false,
    lastContact: "2024-01-05",
    emailThread: 3,
    services: ["Traditional", "Photojournalistic"],
    specialties: ["Portraits", "Candid Shots"],
  },
  {
    id: "2",
    name: "Light & Love Photography",
    instagram: "@lightandlove",
    location: "Westside",
    pricing: "$$",
    priceRange: [2000, 3500],
    rating: 4.9,
    reviews: 89,
    contacted: true,
    booked: false,
    lastContact: "2024-01-15",
    emailThread: 2,
    services: ["Modern", "Candid"],
    specialties: ["Destination Weddings", "Engagement Shoots"],
  },
  {
    id: "3",
    name: "Artisan Lens Co.",
    instagram: "@artisanlens",
    location: "Eastside",
    pricing: "$$$$",
    priceRange: [4000, 6000],
    rating: 5.0,
    reviews: 64,
    contacted: false,
    booked: false,
    services: ["Fine Art", "Editorial"],
    specialties: ["Wedding Portraits", "Bridal Boudoir"],
  },
  {
    id: "4",
    name: "Budget Friendly Photography",
    instagram: "@budgetfriendlyphotos",
    location: "Suburbs",
    pricing: "$",
    priceRange: [500, 1000],
    rating: 4.2,
    reviews: 35,
    contacted: false,
    booked: false,
    services: ["Basic Coverage", "Digital Files"],
    specialties: ["Small Weddings", "Elopements"],
  },
  {
    id: "5",
    name: "Luxury Photography",
    instagram: "@luxuryweddingphotos",
    location: "Downtown",
    pricing: "$$$$$",
    priceRange: [8000, 15000],
    rating: 4.9,
    reviews: 180,
    contacted: true,
    booked: false,
    lastContact: "2024-01-20",
    emailThread: 5,
    services: ["Full Day Coverage", "Drone Footage", "Photo Album"],
    specialties: ["Luxury Events", "Destination Photography"],
  },
]

const initialVideographers: CustomVendor[] = [
  {
    id: "v1",
    name: "Cinematic Moments",
    instagram: "@cinematicmoments",
    location: "Downtown",
    pricing: "$$$",
    priceRange: [3500, 6000],
    rating: 4.9,
    reviews: 87,
    contacted: false,
    booked: false,
    services: ["Wedding Film", "Highlight Reel", "Raw Footage", "Drone Coverage"],
    specialties: ["Cinematic Style", "Documentary", "Same-Day Edit"],
  },
  {
    id: "v2",
    name: "Love Story Films",
    instagram: "@lovestoryfilms",
    location: "Westside",
    pricing: "$$$$",
    priceRange: [4500, 8000],
    rating: 5.0,
    reviews: 64,
    contacted: true,
    booked: false,
    lastContact: "2024-01-15",
    emailThread: 2,
    services: ["Feature Film", "Teaser Trailer", "Social Media Edits", "4K Resolution"],
    specialties: ["Aerial Footage", "Multi-Camera Coverage", "Live Streaming"],
  },
  {
    id: "v3",
    name: "Timeless Videography",
    instagram: "@timelessvideo",
    location: "Eastside",
    pricing: "$$",
    priceRange: [2500, 4000],
    rating: 4.7,
    reviews: 92,
    contacted: false,
    booked: false,
    services: ["Ceremony Coverage", "Reception Coverage", "Digital Delivery"],
    specialties: ["Traditional Style", "Candid Moments", "Budget-Friendly"],
  },
]

export default function CustomVendorPage() {
  const params = useParams()
  const router = useRouter()
  const vendorType = (params.type as string)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const [searchQuery, setSearchQuery] = useState("")
  const [showAddVendor, setShowAddVendor] = useState(false)
  const [showAIContact, setShowAIContact] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<CustomVendor | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [vendors, setVendors] = useState<CustomVendor[]>(
    params.type === "venues"
      ? [
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
      : params.type === "photographers"
        ? photographers
        : params.type === "videographers"
          ? initialVideographers
          : [],
  )

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000])
  const [sortBy, setSortBy] = useState<"rating" | "price-low" | "price-high" | "reviews">("rating")
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)

  const locations = Array.from(new Set(vendors.map((v) => v.location)))

  const filteredVendors = useMemo(() => {
    const filtered = vendors.filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLocation = selectedLocation === "all" || vendor.location === selectedLocation
      const matchesPrice = vendor.priceRange[0] >= priceRange[0] && vendor.priceRange[1] <= priceRange[1]

      return matchesSearch && matchesLocation && matchesPrice
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
  }, [searchQuery, selectedLocation, priceRange, sortBy, vendors])

  const handleContactVendor = (vendor: CustomVendor) => {
    setSelectedVendor(vendor)
    setShowAIContact(true)
  }

  const [newVendorData, setNewVendorData] = useState({
    name: "",
    instagram: "",
    location: "",
    services: "",
    specialties: "",
    priceMin: 0,
    priceMax: 30000, // Updated default priceMax
  })

  const handleAddVendor = () => {
    const newVendor: CustomVendor = {
      id: Date.now().toString(),
      name: newVendorData.name,
      instagram: newVendorData.instagram,
      location: newVendorData.location,
      pricing: getPricingTier(newVendorData.priceMin),
      priceRange: [newVendorData.priceMin, newVendorData.priceMax],
      rating: 0,
      reviews: 0,
      contacted: false,
      booked: false,
      services: newVendorData.services.split(",").map((s) => s.trim()),
      specialties: newVendorData.specialties.split(",").map((s) => s.trim()),
    }

    setVendors((prev) => [...prev, newVendor])
    setShowAddVendor(false)
    setNewVendorData({
      name: "",
      instagram: "",
      location: "",
      services: "",
      specialties: "",
      priceMin: 0,
      priceMax: 30000, // Updated default priceMax
    })
  }

  const getPricingTier = (price: number) => {
    if (price < 1000) return "$"
    if (price < 2500) return "$$"
    if (price < 5000) return "$$$"
    return "$$$$"
  }

  const handleLogout = () => {
    // Add your logout logic here
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-sage-900">
              <Link href="/dashboard/vendors" className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                {vendorType === "Venues" || vendorType === "Videographers"
                  ? vendorType
                  : vendorType === "Photographers"
                    ? vendorType
                    : `${vendorType} Vendors`}
              </Link>
            </h1>
            <p className="mt-2 text-sage-600">
              Find and manage your{" "}
              {vendorType === "Venues" || vendorType === "Videographers"
                ? vendorType.toLowerCase()
                : `${vendorType.toLowerCase()} vendors`}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <AssistantTooltip
              tip="Use our AI-powered template to craft the perfect inquiry email. The template automatically includes key details like your wedding date and helps you ask the right questions about pricing, capacity, and included services."
              side="bottom"
              className="hidden transition-opacity duration-300 opacity-0"
              data-tooltip="quote-template"
              onClose={() => {
                const tooltip = document.querySelector('[data-tooltip="quote-template"]')
                if (tooltip) {
                  tooltip.classList.add("opacity-0")
                  setTimeout(() => {
                    tooltip.classList.add("hidden")
                  }, 300)
                }
              }}
            >
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
            </AssistantTooltip>
            <Dialog open={showFilters} onOpenChange={setShowFilters}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter {vendorType} Vendors</DialogTitle>
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
                    <Label>Price Range</Label>
                    <div className="pt-4 px-2">
                      <Slider
                        value={priceRange}
                        min={0}
                        max={30000}
                        step={1000}
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
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
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
            {params.type === "videographers" ? (
              <Button variant="outline" asChild className="bg-[#738678] hover:bg-[#738678]/90 text-white border-0">
                <Link href="/dashboard/vendors/videographers/compare">
                  <Compare className="mr-2 h-4 w-4" />
                  Compare Videographers
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                asChild
                className="bg-[#738678] hover:bg-[#738678]/90 text-white border-0"
                onClick={() => router.push("/dashboard/vendors/photographers/compare")}
              >
                <Link href="/dashboard/vendors/venues/compare">
                  <Compare className="mr-2 h-4 w-4" />
                  Compare Photographers
                </Link>
              </Button>
            )}
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
            <Dialog open={showAddVendor} onOpenChange={setShowAddVendor}>
              <DialogTrigger asChild>
                <Button className="bg-[#738678] hover:bg-[#738678]/90 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add {vendorType}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New {vendorType} Vendor</DialogTitle>
                  <DialogDescription>Add a {vendorType.toLowerCase()} vendor you've found</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Vendor Name</Label>
                    <Input
                      id="name"
                      value={newVendorData.name}
                      onChange={(e) => setNewVendorData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter vendor name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instagram">Instagram Handle (Optional)</Label>
                    <Input
                      id="instagram"
                      value={newVendorData.instagram}
                      onChange={(e) => setNewVendorData((prev) => ({ ...prev, instagram: e.target.value }))}
                      placeholder="@handle"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newVendorData.location}
                      onChange={(e) => setNewVendorData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter location"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="services">Services (comma-separated)</Label>
                    <Input
                      id="services"
                      value={newVendorData.services}
                      onChange={(e) => setNewVendorData((prev) => ({ ...prev, services: e.target.value }))}
                      placeholder="Service 1, Service 2, Service 3"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                    <Input
                      id="specialties"
                      value={newVendorData.specialties}
                      onChange={(e) => setNewVendorData((prev) => ({ ...prev, specialties: e.target.value }))}
                      placeholder="Specialty 1, Specialty 2, Specialty 3"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Price Range</Label>
                    <div className="pt-4 px-2">
                      <Slider
                        value={[newVendorData.priceMin, newVendorData.priceMax]}
                        min={0}
                        max={30000}
                        step={1000}
                        onValueChange={([min, max]) =>
                          setNewVendorData((prev) => ({
                            ...prev,
                            priceMin: min,
                            priceMax: max,
                          }))
                        }
                      />
                    </div>
                    <div className="flex justify-between text-sm text-sage-600">
                      <span>${newVendorData.priceMin.toLocaleString()}</span>
                      <span>${newVendorData.priceMax.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button onClick={handleAddVendor}>Add Vendor</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <Input
            placeholder={`Search ${vendorType.toLowerCase()} vendors...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          {vendors.length > 0 && (
            <p className="text-sm text-sage-600">
              Showing {filteredVendors.length} vendor{filteredVendors.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="contacted">Contacted</TabsTrigger>
            <TabsTrigger value="not-contacted">Not Contacted</TabsTrigger>
            <TabsTrigger value="booked">Booked</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <CustomVendorCard key={vendor.id} vendor={vendor} onContact={handleContactVendor} />
              ))
            ) : params.type === "photographers" ? (
              // Display photographers when no filter matches and on the photographers page
              photographers.map((photographer) => (
                <CustomVendorCard key={photographer.id} vendor={photographer} onContact={handleContactVendor} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sage-600 mb-4">No vendors added yet</p>
                  <Button className="bg-[#738678] hover:bg-[#738678]/90 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First {vendorType} Vendor
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contacted" className="space-y-6">
            {filteredVendors
              .filter((v) => v.contacted)
              .map((vendor) => (
                <CustomVendorCard key={vendor.id} vendor={vendor} onContact={handleContactVendor} />
              ))}
          </TabsContent>

          <TabsContent value="not-contacted" className="space-y-6">
            {filteredVendors
              .filter((v) => !v.contacted)
              .map((vendor) => (
                <CustomVendorCard key={vendor.id} vendor={vendor} onContact={handleContactVendor} />
              ))}
          </TabsContent>

          <TabsContent value="booked" className="space-y-6">
            {filteredVendors
              .filter((v) => v.booked)
              .map((vendor) => (
                <CustomVendorCard key={vendor.id} vendor={vendor} onContact={handleContactVendor} />
              ))}
          </TabsContent>
        </Tabs>

        {selectedVendor && (
          <AIContactDialog
            open={showAIContact}
            onOpenChange={setShowAIContact}
            vendor={{
              name: selectedVendor.name,
              category: vendorType,
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
            name: selectedVendor?.name || "[Videographer Name]",
            category: vendorType,
          }}
        />
      </div>
    </div>
  )
}

interface CustomVendorCardProps {
  vendor: CustomVendor
  onContact: (vendor: CustomVendor) => void
}

function CustomVendorCard({ vendor, onContact }: CustomVendorCardProps) {
  return (
    <Card key={vendor.id} className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xl font-semibold">
            {vendor.name}
            {vendor.booked && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Booked
              </span>
            )}
          </CardTitle>
          <CardDescription className="flex items-center gap-4 mt-1">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {vendor.location}
            </span>
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {vendor.pricing} (${vendor.priceRange[0].toLocaleString()} - ${vendor.priceRange[1].toLocaleString()})
            </span>
            {vendor.rating > 0 && (
              <span className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                {vendor.rating} ({vendor.reviews} reviews)
              </span>
            )}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {vendor.instagram && (
            <Button variant="outline" size="icon" asChild>
              <a
                href={`https://www.instagram.com/${vendor.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button
            variant={vendor.contacted ? "outline" : "default"}
            className={!vendor.contacted ? "bg-[#738678] hover:bg-[#738678]/90 text-white" : ""}
            onClick={() => onContact(vendor)}
          >
            <Mail className="h-4 w-4 mr-2" />
            {vendor.contacted ? "Follow up" : "Contact"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {vendor.services.map((service) => (
              <span
                key={service}
                className="inline-flex items-center rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-800"
              >
                {service}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {vendor.specialties.map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                {specialty}
              </span>
            ))}
          </div>
          <AICommunicationSummary
            vendorName={vendor.name}
            lastContact={vendor.lastContact}
            emailCount={vendor.emailThread}
            status={vendor.contacted ? "in_progress" : "not_started"}
            nextStep={vendor.contacted ? "Follow up on services and pricing details" : "Initial contact"}
          />
        </div>
      </CardContent>
    </Card>
  )
}

