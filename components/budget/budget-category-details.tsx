'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp, Plus, Minus, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { BudgetCategory } from '@/types/budget'

interface BudgetCategoryDetailsProps {
  category: BudgetCategory
  onRemove: (id: string) => void
  onMerge: (sourceId: string, targetId: string) => void
}

const categoryDescriptions: Record<string, string> = {
  venue: "Includes venue rental, ceremony site fee, reception space, outdoor areas, setup/breakdown fees, liability insurance, permits, tables, chairs, basic linens, lighting, climate control, parking, and on-site coordination.",
  catering: "Includes menu, food preparation, service staff, bar service, tableware, setup/cleanup, and gratuities.",
  photography: "Includes pre-wedding consultation, engagement session, full wedding day coverage, second photographer, digital files, online gallery, high-resolution images, print rights, wedding albums, prints, and additional coverage like rehearsal dinner.",
  attire: "Wedding dress/suit, alterations, accessories, shoes, undergarments, veil/headpiece, jewelry, hair accessories, makeup, wedding party attire coordination, preservation, and additional outfits for other events.",
  flowers: "Ceremony flowers, bridal bouquet, bridesmaids bouquets, boutonnieres, corsages, flower girl petals, ceremony arch/chuppah arrangements, aisle decorations, reception centerpieces, cake flowers, and installation/delivery.",
  entertainment: "DJ services or live band, ceremony musicians, cocktail hour entertainment, sound system, lighting equipment, dance floor, microphones, music planning sessions, MCing, and special performance fees.",
  stationery: "Save-the-dates, wedding invitations, RSVP cards, details cards, envelopes, postage, ceremony programs, menu cards, place cards, table numbers, signage, thank you cards, and addressing services.",
  transportation: "Wedding party transportation, bride and groom getaway car, guest shuttles between ceremony/reception/hotels, vintage/specialty vehicles, driver gratuities, and parking coordination.",
  favors: "Guest favors, welcome bags for out-of-town guests, wedding party gifts, parent gifts, welcome dinner favors, and special amenities for destination wedding guests."
}

export function BudgetCategoryDetails({ category, onRemove, onMerge }: BudgetCategoryDetailsProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <span className="font-medium">{category.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onRemove(category.id)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove this category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const targetId = prompt('Enter category ID to merge with:')
                    if (targetId) {
                      onMerge(category.id, targetId)
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Merge with another category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {isExpanded && (
        <div className="ml-10 rounded-lg bg-sage-50 p-4">
          <p className="text-sm text-sage-600">
            {categoryDescriptions[category.id.toLowerCase()] || category.rationale}
          </p>
          {category.contracts && category.contracts.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium">Associated Contracts:</h4>
              <ul className="mt-2 space-y-2">
                {category.contracts.map(contract => (
                  <li key={contract.id} className="flex items-center justify-between text-sm">
                    <span>{contract.name}</span>
                    <span className="font-medium">${contract.amount.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

