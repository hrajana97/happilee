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
  description?: string
  budgetingTips?: string[]
  ranges?: {
    min: number
    max: number
  }
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
  budget: number // Alias for totalBudget for backward compatibility
  location: {
    city: string
    state?: string
    country: string
    isDestination: boolean
    weddingDate?: string
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
  calculatedBudget: {
    categories: BudgetCategory[]
    rationale: {
      totalBudget: string
      locationFactor: number
      seasonalFactor: number
      notes: string[]
    }
    location?: {
      city: string
      state?: string
      country: string
      isDestination: boolean
      weddingDate?: string
    }
  }
  preferences?: {
    cateringStyle?: string
    barService?: string
    photoVideo?: string
    coverage?: string
    floralStyle?: string
    diyElements?: string
    musicChoice?: string
    beautyCoverage?: string
    planningAssistance?: string
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

export type UserData = {
  name: string;
  partnerName?: string;
  weddingDate: string;
  budget: number;
  guestCount: number;
  calculatedBudget?: any;
  isDemo?: boolean;
  preferences?: {
    cateringStyle?: string;
    barService?: string;
    photoVideo?: string;
    coverage?: string;
    floralStyle?: string;
    diyElements?: string;
    musicChoice?: string;
    beautyCoverage?: string;
    planningAssistance?: string;
  };
}

