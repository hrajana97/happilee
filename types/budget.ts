export type BudgetCategory = {
  id: string
  name: string
  percentage: number
  estimatedCost: number
  actualCost: number
  remaining: number
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

export type BudgetPreferences = {
  cateringStyle?: string
  barService?: string
  photoVideo?: string
  coverage?: string
  floralStyle?: string
  diyElements?: string
  musicChoice?: string
  beautyCoverage?: string
  planningAssistance?: string
  coverageHours?: string
  musicHours?: string
  makeupFor?: string[]
  makeupServices?: string[]
  transportationType?: string
  transportationHours?: string
  transportationGuestCount?: number
  weddingPartySize?: string
  ceremonyDecorLevel?: string
  additionalDecorAreas?: string
  entertainment?: string
  beautyStyle?: string
  stationeryType?: string
  saveTheDateType?: string
  invitationType?: string
  bridesmaidCount?: string
  includeFavors?: boolean
  favorCostPerPerson?: string
  // Attire preferences
  dressBudget?: string
  suitBudget?: string
  accessoriesBudget?: string
  needAlterations?: boolean
  needReceptionDress?: boolean
  receptionDressBudget?: string
  suitCount?: string
}

export type CalculatedBudget = {
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
  dayOfWeek?: 'saturday' | 'friday' | 'sunday' | 'weekday'
  adjustedFactors?: {
    seasonal: number
    location: number
  }
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
  calculatedBudget: CalculatedBudget
  preferences?: BudgetPreferences
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
  zipCode?: string
}

export type UserData = {
  name: string
  partnerName?: string
  weddingDate: string
  budget: number
  guestCount: number
  totalBudget?: number
  location?: {
    city: string
    state?: string
    country: string
    isDestination: boolean
    weddingDate?: string
  }
  calculatedBudget?: CalculatedBudget
  isDemo?: boolean
  preferences?: BudgetPreferences
  lastUpdated?: string
}

