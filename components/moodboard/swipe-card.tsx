'use client'

import { motion } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, X, Bookmark, Tag } from 'lucide-react'
import type { FlowerImage } from '@/types/moodboard'

interface SwipeCardProps {
  image: FlowerImage
  onSwipe: (imageId: string, direction: 'left' | 'right') => void
  onSaveForLater: (imageId: string) => void
  onAddTag: (imageId: string) => void
}

export function SwipeCard({ image, onSwipe, onSaveForLater, onAddTag }: SwipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute inset-0"
    >
      <Card className="h-full overflow-hidden">
        <div className="relative h-full">
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center gap-4 p-4">
            <Button
              size="lg"
              variant="outline"
              className="h-16 w-16 rounded-full bg-white/80 backdrop-blur-sm hover:bg-red-50"
              onClick={() => onSwipe(image.id, 'left')}
            >
              <X className="h-8 w-8 text-red-500" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-16 w-16 rounded-full bg-white/80 backdrop-blur-sm hover:bg-green-50"
              onClick={() => onSwipe(image.id, 'right')}
            >
              <Heart className="h-8 w-8 text-green-500" />
            </Button>
          </div>
          <div className="absolute right-4 top-4 z-10 flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm"
              onClick={() => onSaveForLater(image.id)}
            >
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm"
              onClick={() => onAddTag(image.id)}
            >
              <Tag className="h-5 w-5" />
            </Button>
          </div>
          <div className="h-full pt-24">
            <img
              src={image.url || "/placeholder.svg"}
              alt={image.style}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <h3 className="text-xl font-medium text-white mb-2">{image.style}</h3>
            <p className="text-sm text-white/80">{image.description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

