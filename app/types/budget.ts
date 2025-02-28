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

export interface BudgetData {
  totalBudget: number;
  budget: number;
  location: {
    city: string;
    state?: string;
    country: string;
    isDestination: boolean;
  };
  guestCount: number;
  priorities: string[];
  categories: BudgetCategory[];
  lastUpdated: string;
  rationale: {
    notes: string[];
  };
  calculatedBudget: {
    categories: BudgetCategory[];
    rationale: {
      totalBudget: string;
      locationFactor: number;
      seasonalFactor: number;
      notes: string[];
    };
    location?: {
      city: string;
      state?: string;
      country: string;
      isDestination: boolean;
    };
    weddingDate: string;
    dayOfWeek: 'friday' | 'saturday' | 'sunday' | 'other';
  };
} 