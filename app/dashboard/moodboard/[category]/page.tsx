"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SwipeCard } from "@/components/moodboard/swipe-card"
import { ColorPaletteDisplay } from "@/components/moodboard/color-palette"
import type { FlowerImage, ColorPalette } from "@/types/moodboard"
import { ArrowLeft, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Download, Share2, Settings2, X } from "lucide-react"
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

// Sample floral images for the decor-florals category
const floralImages: FlowerImage[] = Array.from({ length: 15 }, (_, i) => ({
  id: `flower-${i + 1}`,
  url: `https://source.unsplash.com/random/800x600/?flowers,wedding${i + 1}`, // Use valid Unsplash URLs
  style: [
    "Modern Minimalist",
    "Romantic Garden",
    "Bohemian Wildflowers",
    "Classic Elegance",
    "Tropical Paradise",
    "Rustic Charm",
    "Contemporary Chic",
    "Vintage Romance",
    "Natural Organic",
    "Glamorous Luxury",
    "Mediterranean",
    "Asian Fusion",
    "Desert Botanical",
    "English Garden",
    "French Country",
  ][i],
  colors: ["#ffffff", "#f0f0f0", "#e0e0e0"], // Placeholder colors
}))

export default function MoodboardCategoryPage() {
  const params = useParams()
  const category = params.category as string
  const [images, setImages] = useState<FlowerImage[]>(floralImages)
  const [likedImages, setLikedImages] = useState<FlowerImage[]>([])
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>({
    primary: "#ffffff",
    secondary: "#f0f0f0",
    accent: ["#e0e0e0", "#d0d0d0", "#c0c0c0"],
  })
  const [showColorDialog, setShowColorDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [sharedLink, setSharedLink] = useState<string | null>(null)
  const [showTagDialog, setShowTagDialog] = useState(false)
  const [currentImage, setCurrentImage] = useState<FlowerImage | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [savedTags, setSavedTags] = useState<Record<string, string[]>>({})

  useEffect(() => {
    const saved = localStorage.getItem("moodboard_tags")
    if (saved) {
      setSavedTags(JSON.parse(saved))
    }
  }, [])

  const handleSwipe = (imageId: string, direction: "left" | "right") => {
    if (direction === "right") {
      const likedImage = images.find((img) => img.id === imageId)
      if (likedImage) {
        setLikedImages((prev) => [...prev, likedImage])
      }
    }
    setImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const handleAddTags = () => {
    if (currentImage) {
      const newTags = [...tags]
      const newSavedTags = { ...savedTags, [currentImage.id]: newTags }
      localStorage.setItem("moodboard_tags", JSON.stringify(newSavedTags))
      setSavedTags(newSavedTags)
      setLikedImages((prev) => prev.map((img) => (img.id === currentImage.id ? { ...img, tags: newTags } : img)))
    }
    setShowTagDialog(false)
    setTags([])
    setCurrentImage(null)
  }

  const handleDownload = useCallback(() => {
    console.log("Downloading moodboard...")
    toast({
      title: "Moodboard Downloaded",
      description: "Your moodboard has been downloaded.",
    })
  }, [])

  const handleShare = useCallback(() => {
    const simulatedLink = "https://example.com/moodboard/share/12345"
    setSharedLink(simulatedLink)
    setShowShareDialog(true)
  }, [])

  const handleCopyLink = useCallback(async () => {
    if (sharedLink) {
      await navigator.clipboard.copy(sharedLink)
      toast({
        title: "Link Copied",
        description: "The shareable link has been copied to your clipboard.",
      })
    }
  }, [sharedLink])

  useEffect(() => {
    if (likedImages.length > 0) {
      setCurrentPalette({
        primary: "#738678", // Sage green
        secondary: "#f8f7f4", // Cream
        accent: ["#e6d7d5", "#b6a6a3", "#8c7b77"], // Pink and brown tones
      })
    }
  }, [likedImages])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && images.length > 0) handleSwipe(images[0].id, "left")
      if (e.key === "ArrowRight" && images.length > 0) handleSwipe(images[0].id, "right")
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [images]) // Added proper dependency array

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
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-8">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/moodboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold text-sage-900">Decor & Florals</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    /* Handle image upload */
                  }}
                >
                  Upload Images
                </Button>
                {images.length === 0 && (
                  <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sage-600">
                Choose from our pre-selected images based on the latest wedding trends. Click ❤️ to save images you love,
                or ✕ to skip. You can also upload images directly.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Swipe Interface */}
          <div className="relative h-[70vh]">
            {images.map((image, index) => (
              <SwipeCard key={image.id} image={image} onSwipe={handleSwipe} />
            ))}
            {images.length === 0 && (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <p className="text-lg text-sage-600">All done! Check out your moodboard below.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Moodboard */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Your Color Palette
                  <Button variant="ghost" size="sm" onClick={() => setShowColorDialog(true)}>
                    <Settings2 className="h-4 w-4" />
                    <span className="sr-only">Edit color palette</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ColorPaletteDisplay palette={currentPalette} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Moodboard</CardTitle>
                <CardDescription>
                  Click on any image to add or edit tags. Tags help you remember what you liked about each image.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {likedImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative group cursor-pointer"
                      onClick={() => {
                        setCurrentImage(image)
                        setTags(savedTags[image.id] || []) // Initialize with saved tags or empty array
                        setShowTagDialog(true)
                      }}
                    >
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.style}
                        className="rounded-lg object-cover aspect-square w-full transition-opacity group-hover:opacity-90"
                      />
                      {image.tags && image.tags.length > 0 ? (
                        <div className="absolute bottom-2 left-2 bg-black/50 p-1 rounded-md">
                          {image.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <Tag className="h-5 w-5 text-white" />
                          <span className="text-white text-sm ml-2">Add tags</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Color Palette Dialog */}
      <Dialog open={showColorDialog} onOpenChange={setShowColorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Color Palette</DialogTitle>
            <DialogDescription>Customize your wedding color palette</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="primary">Primary Color</Label>
              <Input
                id="primary"
                type="color"
                value={currentPalette.primary}
                onChange={(e) => setCurrentPalette((prev) => ({ ...prev, primary: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="secondary">Secondary Color</Label>
              <Input
                id="secondary"
                type="color"
                value={currentPalette.secondary}
                onChange={(e) => setCurrentPalette((prev) => ({ ...prev, secondary: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Accent Colors</Label>
              {currentPalette.accent.map((color, index) => (
                <Input
                  key={index}
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newAccent = [...currentPalette.accent]
                    newAccent[index] = e.target.value
                    setCurrentPalette((prev) => ({ ...prev, accent: newAccent }))
                  }}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Moodboard Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Moodboard</DialogTitle>
            <DialogDescription>Share your wedding vision with others!</DialogDescription>
          </DialogHeader>
          {sharedLink && (
            <div className="space-y-4 pt-4">
              <Input value={sharedLink} readOnly className="bg-muted pointer-events-none" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                  Close
                </Button>
                <Button onClick={handleCopyLink}>Copy Link</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tags</DialogTitle>
            <DialogDescription>
              Add tags to describe what you like about this image (e.g., flowers, colors, style).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}{" "}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTags((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Enter tags (comma-separated)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  const newTags = (e.target.value || "")
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                  setTags((prev) => [...prev, ...newTags])
                  e.target.value = ""
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleAddTags} className="w-full">
                Add Tags
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

