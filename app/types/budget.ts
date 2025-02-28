export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  estimatedCost: number;
  actualCost: number;
  remaining: number;
  priority: 'high' | 'medium' | 'low';
  rationale: string;
  notes?: string;
  description?: string;
  budgetingTips?: string[];
  ranges?: {
    min: number;
    max: number;
  };
}

export interface BudgetPreferences {
  musicChoice?: string;
  musicHours?: number;
  coverageHours?: number;
  makeupFor?: string[];
  makeupServices?: string[];
  transportationType?: 'Standard sedan' | 'Luxury Sedan' | 'SUV' | 'Limo' | 'Party Bus';
  transportationHours?: number;
  cateringStyle?: string;
  barService?: string;
  photoVideo?: string;
  coverage?: string;
  floralStyle?: string;
  diyElements?: string[];
  beautyCoverage?: string;
  planningAssistance?: string;
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
  totalBudget: number;
  guestCount: number;
  location: BudgetLocation;
  preferences?: BudgetPreferences;
  isDemo?: boolean;
  lastUpdated: string;
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
  dayOfWeek: 'saturday' | 'friday' | 'sunday' | 'weekday';
  adjustedFactors?: {
    seasonal?: number;
    location?: number;
    service?: number;
  };
}

// Combined data structure for the budget page
export interface BudgetData {
  budget: number;
  totalBudget: number;
  guestCount: number;
  location: BudgetLocation;
  preferences?: {
    musicChoice?: string;
    musicHours?: number;
    coverageHours?: number;
    makeupFor?: string[];
    makeupServices?: string[];
    transportationType?: 'Standard sedan' | 'Luxury Sedan' | 'SUV' | 'Limo' | 'Party Bus';
    transportationHours?: number;
    cateringStyle?: string;
    barService?: string;
    photoVideo?: string;
    coverage?: string;
    floralStyle?: string;
    diyElements?: string[];
    beautyCoverage?: string;
    planningAssistance?: string;
  };
  calculatedBudget: CalculatedBudget;
  lastUpdated: string;
} 