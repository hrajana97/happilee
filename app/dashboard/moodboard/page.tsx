"use client"

import { useState } from "react"
import { Plus, Heart, ArrowLeft, Share2, X, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuthButtons } from "@/components/moodboard/auth-buttons"
import Link from "next/link"
import type { MoodboardCategory } from "@/types/moodboard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

const moodboards: MoodboardCategory[] = [
  {
    id: "decor-florals",
    name: "Decor & Florals",
    coverImage: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "venue",
    name: "Venue",
    coverImage: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "haldi",
    name: "Haldi",
    coverImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Haldi_Attire_Selection_for_Brides-to-Be_2.jpg-T4uBw66ALxokCzwKumXDVdyuv9hJlv.jpeg",
  },
  {
    id: "reception",
    name: "Reception",
    coverImage: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=60",
  },
]

export default function MoodboardPage() {
  const [showNewMoodboard, setShowNewMoodboard] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopyLink = async () => {
    const shareUrl = window.location.href
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        description: "Link copied to clipboard!",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy link",
      })
    }
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-8">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-sage-900">Wedding Moodboard</h1>
              <p className="mt-2 text-sage-600">Collect and organize your wedding inspiration</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={showNewMoodboard} onOpenChange={setShowNewMoodboard}>
              <DialogTrigger asChild>
                <Button className="bg-[#738678] hover:bg-[#738678]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Moodboard
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Moodboard</DialogTitle>
                  <DialogDescription>Create a new moodboard to organize your wedding inspiration</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Moodboard Name</Label>
                    <Input id="name" placeholder="e.g., Wedding Colors, Table Settings" />
                  </div>
                  <Button onClick={() => setShowNewMoodboard(false)}>Create Moodboard</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#738678] hover:bg-[#738678]/90">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <div className="absolute right-4 top-4">
                  <Button
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => setShowShareDialog(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <DialogHeader>
                  <DialogTitle>Share Moodboard</DialogTitle>
                  <DialogDescription>
                    Anyone with this link will be able to view this moodboard
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input
                      id="link"
                      defaultValue={window.location.href}
                      readOnly
                      className="w-full"
                    />
                  </div>
                  <Button
                    size="icon"
                    className="bg-[#738678] hover:bg-[#738678]/90"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <AuthButtons />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {moodboards.map((moodboard) => (
            <Link
              href={`/dashboard/moodboard/${moodboard.id}`}
              key={moodboard.id}
              className="block transform transition-all duration-200 hover:scale-105"
            >
              <Card className="group relative overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={moodboard.coverImage || "/placeholder.svg"}
                    alt={moodboard.name}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-200 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-all duration-200 group-hover:bg-black/60">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-lg font-medium text-white">{moodboard.name}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

