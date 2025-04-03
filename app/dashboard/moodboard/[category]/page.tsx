"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SwipeCard } from "@/components/moodboard/swipe-card"
import { ColorPalette } from "@/components/moodboard/color-palette"
import type { FlowerImage, MoodboardCollection } from "@/types/moodboard"
import { ArrowLeft, Tag, Share2, Bookmark, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TagDialog } from "@/components/moodboard/tag-dialog"
import { useToast } from "@/components/ui/use-toast"

// Sample data - replace with actual data fetching
const sampleImages: FlowerImage[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&auto=format&fit=crop&q=60",
    style: "Modern Minimalist",
    description: "Clean lines and elegant simplicity",
    colors: ["#FFFFFF", "#000000", "#E0E0E0"],
    tags: ["Modern", "Minimalist", "Elegant"],
    source: {
      name: "Unsplash",
      url: "https://unsplash.com",
      attribution: "Photo by John Doe"
    }
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=60",
    style: "Rustic Romance",
    description: "Natural elements with romantic touches",
    colors: ["#D4B59D", "#E8F0E3", "#F5E6E8"],
    tags: ["Rustic", "Romantic", "Natural"],
    source: {
      name: "Unsplash",
      url: "https://unsplash.com",
      attribution: "Photo by Jane Smith"
    }
  }
]

const sampleCollections: MoodboardCollection[] = [
  {
    id: "decor-florals",
    name: "Decor & Florals",
    description: "Wedding decoration and floral arrangements",
    images: [],
    colorPalette: {
      primary: "#738678",
      secondary: "#E8F0E3",
      accent: ["#D4B59D", "#F5E6E8"],
      dominantColors: ["#738678", "#E8F0E3", "#D4B59D"],
      mood: "Romantic and Elegant"
    },
    tags: ["Florals", "Decor", "Romantic"],
    vendorRecommendations: [
      {
        name: "Blooms & Beyond",
        type: "Florist",
        description: "Specializes in romantic floral arrangements",
        website: "https://example.com",
        location: "San Francisco"
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function MoodboardCategoryPage() {
  const params = useParams()
  const category = params.category as string
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showTagDialog, setShowTagDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<FlowerImage | null>(null)
  const [likedImages, setLikedImages] = useState<FlowerImage[]>([])
  const [savedImages, setSavedImages] = useState<FlowerImage[]>([])
  const { toast } = useToast()

  const handleSwipe = (imageId: string, direction: 'left' | 'right') => {
    if (direction === 'right') {
      const image = sampleImages.find(img => img.id === imageId)
      if (image) {
        setLikedImages(prev => [...prev, image])
        toast({
          description: "Added to your moodboard!",
        })
      }
    }
    setCurrentImageIndex(prev => prev + 1)
  }

  const handleSaveForLater = (imageId: string) => {
    const image = sampleImages.find(img => img.id === imageId)
    if (image) {
      setSavedImages(prev => [...prev, image])
      toast({
        description: "Saved for later!",
      })
    }
  }

  const handleAddTag = (imageId: string) => {
    const image = sampleImages.find(img => img.id === imageId)
    if (image) {
      setSelectedImage(image)
      setShowTagDialog(true)
    }
  }

  const handleTagsChange = (tags: string[]) => {
    if (selectedImage) {
      const updatedImage = { ...selectedImage, tags }
      setSelectedImage(updatedImage)
      // Update the image in the sample data
      const index = sampleImages.findIndex(img => img.id === selectedImage.id)
      if (index !== -1) {
        sampleImages[index] = updatedImage
      }
    }
  }

  const currentImage = sampleImages[currentImageIndex]

  // If not decor-florals category, show placeholder
  if (category !== "decor-florals") {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-semibold text-sage-900">
            {category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h1>
          <p className="mt-2 text-sage-600">Coming soon...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50/50 to-white p-4 md:p-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8">
          <div className="flex items-center gap-8">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/moodboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-sage-900">{category.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h1>
              <p className="mt-2 text-sage-600">Swipe through inspiration images</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Swipe Interface */}
          <div className="relative h-[70vh]">
            {currentImage && (
              <SwipeCard
                image={currentImage}
                onSwipe={handleSwipe}
                onSaveForLater={handleSaveForLater}
                onAddTag={handleAddTag}
              />
            )}
          </div>

          {/* Moodboard */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Color Palette</h2>
              <ColorPalette
                primary={sampleCollections[0].colorPalette.primary}
                secondary={sampleCollections[0].colorPalette.secondary}
                accent={sampleCollections[0].colorPalette.accent}
                dominantColors={sampleCollections[0].colorPalette.dominantColors}
                mood={sampleCollections[0].colorPalette.mood}
              />
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Moodboard</CardTitle>
                <CardDescription>
                  Click on any image to add or edit tags. Tags help you remember what you liked about each image.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Liked Images</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {likedImages.map((image) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt={image.style}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Saved for Later</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {savedImages.map((image) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt={image.style}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tag Dialog */}
      <TagDialog
        open={showTagDialog}
        onOpenChange={setShowTagDialog}
        selectedTags={selectedImage?.tags || []}
        onTagsChange={handleTagsChange}
      />
    </div>
  )
}

