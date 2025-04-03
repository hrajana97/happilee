'use client'

import * as React from 'react'
import { useState, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, ChevronUp, Settings2, Percent } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import type { BudgetCategory } from '@/types/budget'

const categoryDescriptions: Record<string, string> = {
  venue: "Includes venue rental, ceremony site fee, reception space, outdoor areas, setup/breakdown fees, liability insurance, permits, tables, chairs, basic linens, lighting, climate control, parking, and on-site coordination.",
  catering: "Covers menu planning, food preparation, service staff, kitchen equipment, bar service, bartenders, tableware, glassware, linens, buffet/station setup, tasting sessions, delivery, setup, cleanup, and service charges/gratuities.",
  photography: "Includes pre-wedding consultation, engagement session, full wedding day coverage, second photographer, digital files, online gallery, high-resolution images, print rights, wedding albums, prints, and additional coverage like rehearsal dinner.",
  attire: "Wedding dress/suit, alterations, accessories, shoes, undergarments, veil/headpiece, jewelry, hair accessories, makeup, wedding party attire coordination, preservation, and additional outfits for other events.",
  flowers: "Ceremony flowers, bridal bouquet, bridesmaids bouquets, boutonnieres, corsages, flower girl petals, ceremony arch/chuppah arrangements, aisle decorations, reception centerpieces, cake flowers, and installation/delivery.",
  entertainment: "DJ services or live band, ceremony musicians, cocktail hour entertainment, sound system, lighting equipment, dance floor, microphones, music planning sessions, MCing, and special performance fees.",
  stationery: "Save-the-dates, wedding invitations, RSVP cards, details cards, envelopes, postage, ceremony programs, menu cards, place cards, table numbers, signage, thank you cards, and addressing services.",
  transportation: "Wedding party transportation, bride and groom getaway car, guest shuttles between ceremony/reception/hotels, vintage/specialty vehicles, driver gratuities, and parking coordination.",
  favors: "Guest favors, welcome bags for out-of-town guests, wedding party gifts, parent gifts, welcome dinner favors, and special amenities for destination wedding guests."
}

interface BudgetTableProps {
  categories: BudgetCategory[]
  onUpdateCategory: (categoryId: string, updates: Partial<BudgetCategory>, isReallocating?: boolean) => void
  onRemoveCategory: (categoryId: string) => void
  totalBudget: number
  onUpdateTotalBudget: (newTotal: number) => void
}

type ReallocationOption = 'remove' | 'redistribute' | 'specific'

interface ReallocationTarget {
  categoryId: string
  amount: number
}

const BudgetTable: React.FC<BudgetTableProps> = ({ 
  categories, 
  onUpdateCategory, 
  onRemoveCategory,
  totalBudget,
  onUpdateTotalBudget
}) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState<string>('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAdjustments, setShowAdjustments] = useState(false)
  const [adjustedCategory, setAdjustedCategory] = useState<BudgetCategory | null>(null)
  const [showReallocation, setShowReallocation] = useState(false)
  const [categoryToRemove, setCategoryToRemove] = useState<BudgetCategory | null>(null)
  const [reallocationTargets, setReallocationTargets] = useState<ReallocationTarget[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [reallocationStep, setReallocationStep] = useState<'select' | 'amount'>('select')

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount)
  }, [])

  const formatPercentage = useCallback((amount: number) => {
    return ((amount / totalBudget) * 100).toFixed(1) + '%'
  }, [totalBudget])

  const handleSave = useCallback((category: BudgetCategory, newAmount: number) => {
    onUpdateCategory(category.id, {
      actualCost: newAmount,
      remaining: category.estimatedCost - newAmount
    })
    setEditingId(null)
  }, [onUpdateCategory])

  const handleAdjustBudget = useCallback((category: BudgetCategory) => {
    setAdjustedCategory(category)
    setShowAdjustments(true)
  }, [])

  const handleSaveAdjustment = useCallback((percentage: number) => {
    if (!adjustedCategory) return

    const newEstimated = Math.round((totalBudget * percentage) / 100)
    onUpdateCategory(adjustedCategory.id, {
      estimatedCost: newEstimated,
      remaining: newEstimated - adjustedCategory.actualCost,
      percentage
    })
    setShowAdjustments(false)
    setAdjustedCategory(null)
  }, [adjustedCategory, totalBudget, onUpdateCategory])

  const handleRemoveCategory = useCallback((category: BudgetCategory) => {
    setCategoryToRemove(category)
    setShowReallocation(true)
    setReallocationStep('select')
    setSelectedCategories([])
    setReallocationTargets([])
  }, [])

  const handleReallocation = useCallback((option: ReallocationOption) => {
    if (!categoryToRemove) return

    const amountToReallocate = categoryToRemove.estimatedCost

    switch (option) {
      case 'remove':
        // Only remove the category, will reduce total budget
        onRemoveCategory(categoryToRemove.id)
        break

      case 'redistribute':
        const remainingCategories = categories.filter(c => c.id !== categoryToRemove.id)
        const amountPerCategory = Math.floor(amountToReallocate / remainingCategories.length)
        const remainder = amountToReallocate - (amountPerCategory * remainingCategories.length)
        
        remainingCategories.forEach((category, index) => {
          const adjustedAmount = index === remainingCategories.length - 1 
            ? amountPerCategory + remainder 
            : amountPerCategory

          const newEstimated = category.estimatedCost + adjustedAmount
          
          onUpdateCategory(category.id, {
            estimatedCost: newEstimated,
            remaining: newEstimated - category.actualCost
          }, true) 
        })
        onRemoveCategory(categoryToRemove.id)
        break

      case 'specific':
        if (reallocationTargets.length > 0) {
          const totalReallocated = reallocationTargets.reduce((sum, target) => sum + target.amount, 0)
          if (Math.abs(totalReallocated - amountToReallocate) > 1) {
            alert('Total reallocated amount must equal the category amount')
            return
          }

          reallocationTargets.forEach(target => {
            const targetCategory = categories.find(c => c.id === target.categoryId)
            if (targetCategory) {
              const newEstimated = targetCategory.estimatedCost + target.amount
              
              onUpdateCategory(targetCategory.id, {
                estimatedCost: newEstimated,
                remaining: newEstimated - targetCategory.actualCost
              }, true) 
            }
          })
          onRemoveCategory(categoryToRemove.id)
        }
        break
    }

    setShowReallocation(false)
    setCategoryToRemove(null)
    setSelectedCategories([])
    setReallocationTargets([])
    setReallocationStep('select')
  }, [categoryToRemove, categories, onUpdateCategory, onRemoveCategory, reallocationTargets])

  const handleCategorySelect = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked 
        ? [...prev, categoryId]
        : prev.filter(id => id !== categoryId)
    )
  }

  const handleAmountChange = (categoryId: string, amount: number) => {
    setReallocationTargets(prev => {
      const newTargets = prev.filter(t => t.categoryId !== categoryId)
      if (amount > 0) {
        newTargets.push({ categoryId, amount })
      }
      return newTargets
    })
  }

  const remainingToAllocate = categoryToRemove 
    ? categoryToRemove.estimatedCost - reallocationTargets.reduce((sum, target) => sum + target.amount, 0)
    : 0

  const handleEstimatedCostEdit = (category: BudgetCategory) => {
    setEditingId(category.id)
    setEditingValue(category.estimatedCost.toString())
  }

  const handleEstimatedCostSave = (category: BudgetCategory) => {
    const newValue = parseInt(editingValue)
    if (!isNaN(newValue) && newValue >= 0) {
      const oldValue = category.estimatedCost
      const difference = newValue - oldValue
      
      // Update the category
      onUpdateCategory(category.id, {
        estimatedCost: newValue,
        remaining: newValue - (category.actualCost || 0),
        percentage: (newValue / (totalBudget + difference)) * 100
      })

      // Update total budget
      onUpdateTotalBudget(totalBudget + difference)
    }
    setEditingId(null)
  }

  const handleEstimatedCostKeyDown = (e: React.KeyboardEvent, category: BudgetCategory) => {
    if (e.key === 'Enter') {
      handleEstimatedCostSave(category)
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Category</TableHead>
                <TableHead>Estimated</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <React.Fragment key={category.id}>
                  <TableRow>
                    <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setExpandedId(expandedId === category.id ? null : category.id)}
                        >
                          {expandedId === category.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell 
                      className="px-2 py-3 sm:px-4 sm:py-4 cursor-pointer hover:bg-sage-50"
                      onClick={() => handleEstimatedCostEdit(category)}
                    >
                      {editingId === category.id ? (
                        <Input
                          type="number"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => handleEstimatedCostSave(category)}
                          onKeyDown={(e) => handleEstimatedCostKeyDown(e, category)}
                          className="w-24"
                          autoFocus
                        />
                      ) : (
                        formatCurrency(category.estimatedCost)
                      )}
                    </TableCell>
                    <TableCell className="px-2 py-3 sm:px-4 sm:py-4">{formatCurrency(category.actualCost)}</TableCell>
                    <TableCell className={`px-2 py-3 sm:px-4 sm:py-4 ${category.remaining < 0 ? 'text-red-500' : ''}`}>
                      {formatCurrency(category.remaining)}
                    </TableCell>
                    <TableCell className="px-2 py-3 sm:px-4 sm:py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => handleRemoveCategory(category)}
                        >
                          <Settings2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedId === category.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-sage-50">
                        <div className="p-4 space-y-4">
                          <div className="space-y-2">
                            {(category as BudgetCategory).priority === 'high' && (
                              <div className="text-sm font-medium text-sage-700">
                                ⭐ Prioritized Category
                              </div>
                            )}
                            <div className="text-sm text-sage-600">
                              {categoryDescriptions[category.id.toLowerCase()] || category.rationale}
                            </div>
                          </div>
                          {category.contracts && category.contracts.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Included Services:</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {category.contracts.map(contract => (
                                  <li key={contract.id} className="text-sm text-sage-600">
                                    {contract.name} - {formatCurrency(contract.amount)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={showAdjustments} onOpenChange={setShowAdjustments}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Budget Allocation</DialogTitle>
            <DialogDescription>
              Adjust the percentage of total budget allocated to {adjustedCategory?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Current: {adjustedCategory ? formatPercentage(adjustedCategory.estimatedCost) : '0%'}</span>
                <span>{formatCurrency(adjustedCategory?.estimatedCost || 0)}</span>
              </div>
              <Slider
                defaultValue={[adjustedCategory ? (adjustedCategory.estimatedCost / totalBudget) * 100 : 0]}
                max={50}
                step={0.5}
                onValueChange={(value) => handleSaveAdjustment(value[0])}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showReallocation} onOpenChange={setShowReallocation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {categoryToRemove?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              How would you like to handle the {formatCurrency(categoryToRemove?.estimatedCost || 0)} allocated to this category?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            {reallocationStep === 'select' ? (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleReallocation('remove')}
                >
                  Remove from total budget
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleReallocation('redistribute')}
                >
                  Redistribute evenly across other categories
                </Button>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Or select specific categories to reallocate to:</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {categories
                      .filter(c => c.id !== categoryToRemove?.id)
                      .map(category => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.id}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={(checked) => 
                              handleCategorySelect(category.id, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={category.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))
                    }
                  </div>
                  {selectedCategories.length > 0 && (
                    <Button 
                      className="w-full mt-4"
                      onClick={() => setReallocationStep('amount')}
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Enter amount to reallocate to each category:</h4>
                <div className="space-y-4">
                  {selectedCategories.map(categoryId => {
                    const category = categories.find(c => c.id === categoryId)
                    if (!category) return null
                    
                    return (
                      <div key={categoryId} className="space-y-2">
                        <label className="text-sm">{category.name}</label>
                        <Input
                          type="number"
                          value={reallocationTargets.find(t => t.categoryId === categoryId)?.amount || ''}
                          onChange={(e) => handleAmountChange(categoryId, Number(e.target.value))}
                          placeholder="Enter amount"
                        />
                      </div>
                    )
                  })}
                  <div className="text-sm text-sage-600">
                    Remaining to allocate: {formatCurrency(remainingToAllocate)}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setReallocationStep('select')}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => handleReallocation('specific')}
                    disabled={remainingToAllocate !== 0}
                  >
                    Confirm Reallocation
                  </Button>
                </div>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowReallocation(false)
              setCategoryToRemove(null)
              setSelectedCategories([])
              setReallocationTargets([])
              setReallocationStep('select')
            }}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default BudgetTable

