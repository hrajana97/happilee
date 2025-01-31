export type BudgetCategory = {
  id: string
  name: string
  percentage: number
  estimatedCost: number
  actualCost: number
  remaining: number
  priority: 'high' | 'medium' | 'low'
  rationale: string
  notes?: string
  contracts?: {
    id: string
    name: string
    amount: number
    date: string
    status: 'pending' | 'paid'
  }[]
}

export type BudgetData = {
  totalBudget: number
  location: {
    city: string
    state?: string
    country: string
    isDestination: boolean
  }
  guestCount: number
  priorities: string[]
  categories: BudgetCategory[]
  lastUpdated: string
  rationale: {
    totalBudget: string
    locationFactor: number
    seasonalFactor: number
    notes: string[]
  }
}

export type BudgetPriority = {
  id: string
  name: string
  selected: boolean
}

export type LocationData = {
  city: string
  state?: string
  country: string
  costFactor: number
}

