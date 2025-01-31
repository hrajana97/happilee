"use client"

import { useState } from "react"
import { VendorCategories } from "@/components/vendors/vendor-categories"
import { VendorChat } from "@/components/vendors/vendor-chat"
import { VendorList } from "@/components/vendors/vendor-list"
import { useParams } from "next/navigation"

export type VendorCategory = {
  id: string
  name: string
  icon: string
  description: string
  status: "not_started" | "searching" | "booked"
}

export type Vendor = {
  id: string
  name: string
  category: string
  location: string
  pricing: string
  description: string
  specialties: string[]
  rating: number
  reviews: number
  availability: string[]
}

export default function VendorCategoryPage() {
  const params = useParams()
  const categoryId = params.categoryId as string
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory | null>(null)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-sage-50/50 to-white p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-6">
            <VendorCategories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              initialCategoryId={categoryId}
            />
            {selectedCategory && (
              <VendorList
                category={selectedCategory}
                selectedVendor={selectedVendor}
                onSelectVendor={setSelectedVendor}
              />
            )}
          </div>

          {selectedVendor && (
            <div className="lg:border-l lg:pl-6">
              <VendorChat category={selectedCategory!} vendor={selectedVendor} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

