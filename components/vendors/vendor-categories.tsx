"use client"

import { Camera, Music, Utensils, Flower2, Car, Cake, Wine, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { VendorCategory } from "@/app/dashboard/vendors/[categoryId]/page"

type VendorCategoriesProps = {
  selectedCategory: VendorCategory | null
  onSelectCategory: (category: VendorCategory) => void
  initialCategoryId?: string
}

const categories: VendorCategory[] = [
  {
    id: "musicians",
    name: "Music",
    icon: "Music",
    description: "DJs and live bands",
    status: "searching",
  },
  {
    id: "caterers",
    name: "Catering",
    icon: "Utensils",
    description: "Food and beverage services",
    status: "booked",
  },
  {
    id: "florists",
    name: "Florals",
    icon: "Flower2",
    description: "Floral arrangements and decor",
    status: "not_started",
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: "Car",
    description: "Wedding day transportation",
    status: "not_started",
  },
  {
    id: "bakers",
    name: "Cake & Desserts",
    icon: "Cake",
    description: "Wedding cakes and desserts",
    status: "not_started",
  },
]

const iconComponents = {
  Music,
  Utensils,
  Flower2,
  Car,
  Cake,
  Wine,
  Users,
}

export function VendorCategories({ selectedCategory, onSelectCategory, initialCategoryId }: VendorCategoriesProps) {
  // If there's an initialCategoryId and no selected category, select it
  React.useEffect(() => {
    if (initialCategoryId && !selectedCategory) {
      const category = categories.find((c) => c.id === initialCategoryId)
      if (category) {
        onSelectCategory(category)
      }
    }
  }, [initialCategoryId, selectedCategory, onSelectCategory])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Categories</CardTitle>
        <CardDescription>Select a category to view available vendors</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {categories.map((category) => {
          const IconComponent = iconComponents[category.icon as keyof typeof iconComponents]
          return (
            <Button
              key={category.id}
              variant={selectedCategory?.id === category.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onSelectCategory(category)}
            >
              {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
              <span className="flex-1 text-left">{category.name}</span>
              {category.status === "booked" && (
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  Booked
                </span>
              )}
              {category.status === "searching" && (
                <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                  Searching
                </span>
              )}
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}

