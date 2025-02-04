'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SwipeCard } from '@/components/moodboard/swipe-card'
import { ColorPaletteDisplay } from '@/components/moodboard/color-palette'
import { Button } from "@/components/ui/button"
import { Heart, X, ArrowLeft } from 'lucide-react'
import type { FlowerImage, ColorPalette } from '@/types/moodboard'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from 'next/link'

const floralImages: FlowerImage[] = [
  {
    id: '1',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-12%20at%209.50.24%20AM-v1kFlDPAbjkfkZ2NcAfEgqWFD6W6oi.png',
    style: 'Romantic Garden',
    description: 'Soft pastel arrangement with dahlias and delphiniums',
    colors: ['#FFB5BA', '#A5C7E4', '#FFFFFF']
  },
  {
    id: '2',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-12%20at%209.50.48%20AM-qYGHGOZ3QYlCU3cMmBVPUhDIwbp64f.png',
    style: 'Traditional Mandap',
    description: 'Dramatic red and gold ceremony setup',
    colors: ['#FF0000', '#FFD700', '#006400']
  },
  {
    id: '3',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-12%20at%209.51.07%20AM-pPa3oUZ4n2LXOFY58B3sl8V9YvHbMW.png',
    style: 'Modern Classic',
    description: 'Blue and orange tablescape with ranunculus',
    colors: ['#FF6B35', '#004E89', '#FFD700']
  },
  {
    id: '4',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-12%20at%209.51.35%20AM-vnkA2f8qOnqPCQrbsk028qLYe3f4Jn.png',
    style: 'Garden Ceremony',
    description: 'Pastel floral arch with wildflower aisle',
    colors: ['#FFB5BA', '#A5C7E4', '#90EE90']
  },
  {
    id: '5',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-12%20at%209.50.59%20AM-e2pbAQq2wvcNjM0LH6t8Svq1GLPucZ.png',
    style: 'Tropical Sunset',
    description: 'Vibrant orange and yellow centerpiece',
    colors: ['#FF6B35', '#FFD700', '#228B22']
  },
  {
    id: '6',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-12%20at%209.53.27%20AM-lyXO2Y0kbsSgXFfcB8vyHpMmitBJ87.png',
    style: 'Modern Minimalist',
    description: 'White and green modern reception',
    colors: ['#FFFFFF', '#E8E8E8', '#228B22']
  },
  {
    id: '7',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-12%20at%209.52.51%20AM-1skxQ9FFJ5EROZX3SKKkph2X8NT0iB.png',
    style: 'Coastal Elegance',
    description: 'Seaside tablescape with coral and blue',
    colors: ['#FF6B35', '#004E89', '#90EE90']
  },
  {
    id: '8',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-12%20at%209.50.38%20AM-EBzEd9gTwa8ytv3yE0W9pnRShg2MTE.png',
    style: 'Fusion Mandap',
    description: 'Peach and marigold floral arch',
    colors: ['#FFAA5C', '#FFD700', '#228B22']
  },
  {
    id: '9',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-12%20at%209.51.41%20AM-ghGQeMEJxCyuDhpYRMewGSEh4oXsR8.png',
    style: 'Wildflower Cake',
    description: 'White cake with wildflower cascade',
    colors: ['#FFFFFF', '#FF6B35', '#FF69B4']
  }
]

function generateAestheticDescription(likedImages: FlowerImage[]): string {
  const styles = likedImages.map(img => img.style.toLowerCase())
  
  // Count style occurrences
  const styleCount: Record<string, number> = {}
  styles.forEach(style => {
    styleCount[style] = (styleCount[style] || 0) + 1
  })

  // Get dominant styles (top 2-3)
  const dominantStyles = Object.entries(styleCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([style]) => style)

  // Generate description based on dominant styles
  if (dominantStyles.includes('romantic garden') && dominantStyles.includes('bohemian wildflowers')) {
    return "Whimsical garden romance with organic, free-flowing elements"
  } else if (dominantStyles.includes('modern minimalist')) {
    return "Clean, contemporary elegance with refined details"
  } else if (dominantStyles.includes('classic elegance')) {
    return "Timeless sophistication with traditional flourishes"
  } else if (dominantStyles.includes('tropical paradise')) {
    return "Vibrant, exotic atmosphere with lush greenery"
  } else if (dominantStyles.includes('rustic charm')) {
    return "Warm, natural aesthetic with countryside inspiration"
  }

  return "Eclectic blend of styles creating a unique, personalized atmosphere"
}

export default function DecorFloralsPage() {
  const [images, setImages] = useState<FlowerImage[]>(floralImages)
  const [likedImages, setLikedImages] = useState<FlowerImage[]>([])
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>({
    primary: '#FFFFFF',
    secondary: '#F8F8F8',
    accent: ['#FFB5BA', '#A5C7E4', '#90EE90']
  })
  const [swipeCount, setSwipeCount] = useState(0)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [aestheticDescription, setAestheticDescription] = useState<string>('')

  const handleSwipe = (imageId: string, direction: 'left' | 'right') => {
    setSwipeCount(prev => prev + 1)

    if (direction === 'right') {
      const likedImage = images.find(img => img.id === imageId)
      if (likedImage) {
        setLikedImages(prev => [...prev, { ...likedImage, liked: true }])
        updateColorPalette(likedImage.colors)
      }
    }

    if (swipeCount < images.length - 1) {
      setImages(prev => prev.filter(img => img.id !== imageId))
    } else {
      const description = generateAestheticDescription(likedImages)
      setAestheticDescription(description)
      setShowCompletionDialog(true)
    }
  }

  const updateColorPalette = (newColors: string[]) => {
    setCurrentPalette(prev => ({
      primary: newColors[0],
      secondary: newColors[1],
      accent: [
        newColors[2],
        prev.accent[1],
        prev.accent[2]
      ]
    }))
  }

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (images.length === 0) return
      if (e.key === 'ArrowLeft') handleSwipe(images[0].id, 'left')
      if (e.key === 'ArrowRight') handleSwipe(images[0].id, 'right')
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [images])

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
              <h1 className="text-2xl font-semibold text-sage-900">Decor & Florals</h1>
              <p className="mt-2 text-sage-600">Find your perfect wedding style</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Swipe Interface */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] w-full max-w-2xl mx-auto">
              {images.map((image, index) => (
                <SwipeCard
                  key={image.id}
                  image={image}
                  onSwipe={handleSwipe}
                />
              ))}
              {images.length === 0 && (
                <Card className="absolute inset-0 flex items-center justify-center">
                  <CardContent className="text-center">
                    <p className="text-lg text-sage-600">All done! Check out your moodboard.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="text-center text-sm text-sage-600">
              Click heart to save, X to skip
            </div>
          </div>

          {/* Moodboard */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Color Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <ColorPaletteDisplay palette={currentPalette} />
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Your Moodboard</CardTitle>
                {aestheticDescription && (
                  <p className="text-sm text-sage-600 mt-1 italic">
                    {aestheticDescription}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {likedImages.map((image) => (
                    <div key={image.id} className="group relative overflow-hidden rounded-lg">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.style}
                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="absolute bottom-0 p-4">
                          <h3 className="text-sm font-medium text-white">{image.style}</h3>
                          <p className="text-xs text-white/80">{image.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {likedImages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sage-600">
                      Click the heart button on styles you love
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your Wedding Style</DialogTitle>
              <DialogDescription>
                Based on your choices, your wedding style can be described as:
                <p className="mt-2 text-lg font-medium text-sage-900">
                  {aestheticDescription}
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={() => setShowCompletionDialog(false)}>
                Keep Browsing
              </Button>
              <Button onClick={() => {
                setImages([])
                setShowCompletionDialog(false)
              }}>
                Finalize Moodboard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

