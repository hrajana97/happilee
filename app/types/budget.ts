export interface BudgetCategory {
  id: string;
  name: string;
  estimatedCost: number;
  actualCost?: number;
  remaining?: number;
  percentage: number;
  priority?: 'high' | 'medium' | 'low';
  rationale?: string;
  notes?: string;
  description?: string;
  budgetingTips?: string[];
  ranges?: {
    min: number;
    max: number;
  };
  currentChoice?: string;
  alternatives?: Array<{
    option: string;
    savings: number;
  }>;
}

export type BudgetPreferences = {
  cateringStyle?: string
  barService?: string
  photoVideo?: string
  coverage?: string
  floralStyle?: string
  diyElements?: string
  musicChoice?: string
  ceremonyMusic?: 'Live Music' | 'No Live - Will Use Recorded Track' | 'None'
  beautyCoverage?: string
  planningAssistance?: string
  coverageHours?: string
  musicHours?: string
  makeupFor?: string[]
  makeupServices?: string[]
  transportationType?: 'None' | 'Guest Shuttle Service' | 'Wedding Party Transportation' | 'Both'
  transportationHours?: string
  transportationGuestCount?: string
}

export interface BudgetLocation {
  city: string;
  state?: string;
  country: string;
  isDestination: boolean;
  weddingDate?: string;
}

// Base user data
export interface UserData {
  name: string;
  partnerName?: string;
  weddingDate: string;
  budget: number;
  totalBudget?: number;
  guestCount: number;
  location?: BudgetLocation;
  preferences?: BudgetPreferences;
  isDemo?: boolean;
  lastUpdated?: string;
  calculatedBudget?: CalculatedBudget;
}

// Calculated budget data
export interface CalculatedBudget {
  categories: BudgetCategory[];
  rationale: {
    totalBudget: string;
    locationFactor: number;
    seasonalFactor: number;
    notes: string[];
  };
  location?: BudgetLocation;
  dayOfWeek: 'saturday' | 'friday' | 'sunday' | 'weekday';
  adjustedFactors: {
    seasonal: number;
    location: number;
    service?: number;
  };
}

// Combined data structure for the budget page
export interface BudgetData {
  budget: number;
  totalBudget: number;
  guestCount: number;
  location: BudgetLocation;
  preferences?: BudgetPreferences;
  calculatedBudget: CalculatedBudget;
  lastUpdated: string;
} 