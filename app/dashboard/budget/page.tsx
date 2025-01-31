'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import BudgetTable from '@/components/budget/budget-table'
import BudgetTimeline from '@/components/budget/budget-timeline'
import BudgetQuestionnaire from '@/components/budget/budget-questionnaire'
import { storage } from '@/lib/storage'
import budgetStorage from '@/lib/budget-storage'
import type { BudgetCategory, BudgetData } from '@/types/budget'
import { Loader2, AlertCircle, Info } from 'lucide-react'
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

export default function BudgetPage() {
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)
  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    estimatedCost: 0
  })

  // Calculate totals
  const totalSpent = categories.reduce((sum, cat) => sum + cat.actualCost, 0)
  const totalRemaining = (budgetData?.totalBudget || 0) - totalSpent

  // Load initial budget data
  useEffect(() => {
    const loadBudgetData = () => {
      try {
        const savedBudget = budgetStorage.getBudgetData()
        if (savedBudget) {
          setBudgetData(savedBudget)
          setCategories(savedBudget.categories)
          setShowQuestionnaire(false)
        } else {
          setShowQuestionnaire(true)
        }
      } catch (err) {
        console.error('Budget data loading error:', err)
        setError(err instanceof Error ? err : new Error('Failed to load budget data'))
      } finally {
        setIsLoading(false)
      }
    }

    loadBudgetData()
  }, [])

  // Handle questionnaire completion
  const handleQuestionnaireComplete = useCallback((data: {
    hasBudget: boolean
    maxBudget: number
    location: BudgetData['location']
    guestCount: number
    priorities: string[]
  }) => {
    try {
      const result = budgetStorage.calculateBudget(
        data.guestCount,
        data.location,
        data.priorities
      )

      const newBudgetData: BudgetData = {
        totalBudget: data.maxBudget || result.suggestedBudget, // Use maxBudget if provided, otherwise use suggested
        location: data.location,
        guestCount: data.guestCount,
        priorities: data.priorities,
        categories: result.categories.map(category => ({
          ...category,
          // Adjust category amounts proportionally to maxBudget if provided
          estimatedCost: data.maxBudget 
            ? Math.round((category.estimatedCost / result.suggestedBudget) * data.maxBudget)
            : category.estimatedCost,
          remaining: data.maxBudget 
            ? Math.round((category.estimatedCost / result.suggestedBudget) * data.maxBudget)
            : category.estimatedCost
        })),
        lastUpdated: new Date().toISOString(),
        rationale: result.rationale
      }

      budgetStorage.setBudgetData(newBudgetData)
      setBudgetData(newBudgetData)
      setCategories(newBudgetData.categories)
      setShowQuestionnaire(false)
    } catch (err) {
      console.error('Error creating budget:', err)
      setError(err instanceof Error ? err : new Error('Failed to create budget'))
    }
  }, [])

  // Handle category updates
  const handleUpdateCategory = useCallback((
    categoryId: string,
    updates: Partial<BudgetCategory>,
    isReallocating: boolean = false
  ) => {
    if (!budgetData) return

    try {
      const updatedCategories = categories.map(category =>
        category.id === categoryId
          ? { ...category, ...updates }
          : category
      )

      const updatedBudgetData = {
        ...budgetData,
        categories: updatedCategories,
        lastUpdated: new Date().toISOString()
      }

      budgetStorage.setBudgetData(updatedBudgetData)
      setBudgetData(updatedBudgetData)
      setCategories(updatedCategories)
    } catch (err) {
      console.error('Error updating category:', err)
      setError(err instanceof Error ? err : new Error('Failed to update category'))
    }
  }, [budgetData, categories])

  // Handle category removal
  const handleRemoveCategory = useCallback((categoryId: string) => {
    if (!budgetData) return

    try {
      const updatedCategories = categories.filter(category => category.id !== categoryId)
      const updatedBudgetData = {
        ...budgetData,
        categories: updatedCategories,
        lastUpdated: new Date().toISOString()
      }

      budgetStorage.setBudgetData(updatedBudgetData)
      setBudgetData(updatedBudgetData)
      setCategories(updatedCategories)
    } catch (err) {
      console.error('Error removing category:', err)
      setError(err instanceof Error ? err : new Error('Failed to remove category'))
    }
  }, [budgetData, categories])

  // Handle budget reset
  const handleReset = useCallback(() => {
    try {
      budgetStorage.clearBudgetData()
      setBudgetData(null)
      setCategories([])
      setShowQuestionnaire(true)
      setShowResetConfirm(false)
    } catch (err) {
      console.error('Error resetting budget:', err)
      setError(err instanceof Error ? err : new Error('Failed to reset budget'))
    }
  }, [])

  const handleAddCategory = () => {
    if (!budgetData || !newCategory.name || !newCategory.estimatedCost) return

    const newCategoryData: BudgetCategory = {
      id: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
      name: newCategory.name,
      percentage: (newCategory.estimatedCost / budgetData.totalBudget) * 100,
      estimatedCost: newCategory.estimatedCost,
      actualCost: 0,
      remaining: newCategory.estimatedCost,
      priority: 'medium',
      rationale: `Manually added category`
    }

    const updatedCategories = [...categories, newCategoryData]
    const updatedBudgetData = {
      ...budgetData,
      categories: updatedCategories,
      lastUpdated: new Date().toISOString()
    }

    budgetStorage.setBudgetData(updatedBudgetData)
    setBudgetData(updatedBudgetData)
    setCategories(updatedCategories)
    setNewCategory({ name: '', estimatedCost: 0 })
    setShowAddCategory(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-sage-600 mb-4">{error.message}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-sage-600 hover:bg-sage-700"
          >
            Try again
          </Button>
        </div>
      </div>
    )
  }

  // Show questionnaire if no budget data
  if (showQuestionnaire) {
    return <BudgetQuestionnaire onComplete={handleQuestionnaireComplete} />
  }

  // Main budget view
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sage-50/50 to-white p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-sage-900">Wedding Budget</h1>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <p className="text-sm sm:text-base text-sage-600">
                Total Budget: ${budgetData?.totalBudget.toLocaleString()}
              </p>
              <span className="hidden sm:inline text-sage-300">|</span>
              <p className="text-sm sm:text-base text-sage-600">
                Remaining: <span className={totalRemaining < 0 ? 'text-red-500' : ''}>
                  ${totalRemaining.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowQuestionnaire(true)}
              className="w-full sm:w-auto"
            >
              Edit Responses
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowResetConfirm(true)}
              className="w-full sm:w-auto"
            >
              Start Over
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {/* Budget Rationale Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-sage-600" />
                <CardTitle>Budget Breakdown Rationale</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-sage-50 p-4">
                <p className="text-sage-700 mb-2">
                  Your budget of {budgetData?.rationale.totalBudget} has been allocated based on:
                </p>
                <ul className="space-y-2 text-sage-600">
                  {budgetData?.rationale.notes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-sage-400">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
              {budgetData?.priorities.length ? (
                <div>
                  <p className="text-sm font-medium text-sage-700 mb-2">Priority Categories:</p>
                  <div className="flex gap-2">
                    {budgetData.priorities.map((priority) => (
                      <span
                        key={priority}
                        className="inline-flex items-center rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-800"
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Budget Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Budget Breakdown</CardTitle>
                  <CardDescription>
                    Click on any estimated amount to adjust it
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddCategory(true)}
                >
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <BudgetTable
                categories={categories}
                onUpdateCategory={handleUpdateCategory}
                onRemoveCategory={handleRemoveCategory}
                totalBudget={budgetData?.totalBudget || 0}
                onUpdateTotalBudget={(newTotal) => {
                  if (budgetData) {
                    const updatedBudgetData = {
                      ...budgetData,
                      totalBudget: newTotal,
                      lastUpdated: new Date().toISOString()
                    }
                    budgetStorage.setBudgetData(updatedBudgetData)
                    setBudgetData(updatedBudgetData)
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Timeline */}
          <BudgetTimeline
            categories={categories}
            startDate={new Date()}
          />
        </div>

        <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a custom budget category
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estimate">Estimated Cost</Label>
                <Input
                  id="estimate"
                  type="number"
                  value={newCategory.estimatedCost || ''}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, estimatedCost: Number(e.target.value) }))}
                  placeholder="Enter estimated cost"
                />
              </div>
              <Button 
                onClick={handleAddCategory}
                disabled={!newCategory.name || !newCategory.estimatedCost}
              >
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Budget</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete your current budget and start over. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700"
              >
                Start Over
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

