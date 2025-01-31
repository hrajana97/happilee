"use client"
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Music, Utensils, Flower2, Car, Cake, Wine, Users, Video, CameraIcon } from "lucide-react" // Import CameraIcon
import Link from "next/link"
import { cn } from "@/lib/utils"

const iconMap = {
  photographer: CameraIcon, // Use CameraIcon here
  musician: Music,
  caterer: Utensils,
  florist: Flower2,
  transport: Car,
  baker: Cake,
  bartender: Wine,
  planner: Users,
  venues: Users,
  videographers: Video,
  photographers: CameraIcon, // Use CameraIcon here
}

export type VendorCategory = {
  id: string
  name: string
  type: keyof typeof iconMap | "custom" | "venues" | "videographers" | "photographers"
  description: string
  vendorCount: number
  status: "not_started" | "searching" | "booked"
  href: string // Make href required
  timeline: string
}

interface VendorCategoryCardProps {
  category: VendorCategory
}

export function VendorCategoryCard({ category }: VendorCategoryCardProps) {
  const href = category.href
  const Icon = iconMap[category.type] || Users // Default to Users icon

  return (
    <Card className="hover:shadow-lg transition-all duration-300 bg-[#F3F5F2] border-sage-200/50">
      <Link href={href} className="block">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{category.name}</CardTitle>
            <Badge
              variant={
                category.status === "booked" ? "default" : category.status === "searching" ? "secondary" : "outline"
              }
              className="whitespace-nowrap text-xs px-2 py-0.5"
            >
              {category.status === "booked" ? "Booked" : category.status === "searching" ? "Searching" : "Not Started"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Render the icon only if it exists */}
            {Icon && <Icon className="h-4 w-4 text-sage-600" />}
            <span className="text-sm text-sage-600 hover:text-sage-700">{category.description}</span>
          </div>
          <span className="text-sm text-[#738678]">View details →</span>
        </CardContent>
      </Link>
    </Card>
  )
}

