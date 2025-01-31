import type { BudgetData, LocationData } from '@/types/budget'

// Custom error class for budget-related errors
export class BudgetError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'BudgetError'
  }
}

// Cost factors by location (expanded with suburbs)
const locationCostFactors: Record<string, number> = {
  // San Francisco Bay Area
  'San Francisco, CA': 2.0,
  'Palo Alto, CA': 1.9,
  'Mountain View, CA': 1.85,
  'San Jose, CA': 1.8,
  'Oakland, CA': 1.75,
  'Cupertino, CA': 1.85,
  'Saratoga, CA': 1.9,
  
  // New York Area
  'New York, NY': 2.0,
  'Brooklyn, NY': 1.8,
  'Long Island, NY': 1.75,
  'Westchester, NY': 1.85,
  'Jersey City, NJ': 1.7,
  
  // Los Angeles Area
  'Los Angeles, CA': 1.8,
  'Beverly Hills, CA': 2.0,
  'Santa Monica, CA': 1.9,
  'Pasadena, CA': 1.7,
  'Orange County, CA': 1.75,
  
  // Chicago Area
  'Chicago, IL': 1.6,
  'Evanston, IL': 1.5,
  'Oak Park, IL': 1.45,
  'Naperville, IL': 1.4,
  'Highland Park, IL': 1.55,
  'Winnetka, IL': 1.6,
  'Lake Forest, IL': 1.55,
  'Hinsdale, IL': 1.5,

  // Detroit Area
  'Detroit, MI': 1.2,
  'Birmingham, MI': 1.4,
  'Bloomfield Hills, MI': 1.45,
  'Royal Oak, MI': 1.25,
  'Grosse Pointe, MI': 1.4,
  'Ann Arbor, MI': 1.3,

  // St. Louis Area
  'St. Louis, MO': 1.3,
  'Clayton, MO': 1.4,
  'Ladue, MO': 1.45,
  'Chesterfield, MO': 1.35,
  'Kirkwood, MO': 1.3,
  'Webster Groves, MO': 1.25,
  
  // Miami Area
  'Miami, FL': 1.5,
  'Miami Beach, FL': 1.7,
  'Coral Gables, FL': 1.6,
  'Boca Raton, FL': 1.5,
  
  // Tampa Area
  'Tampa, FL': 1.2,
  'St. Petersburg, FL': 1.15,
  'Clearwater, FL': 1.1,
  'Sarasota, FL': 1.25,
  
  // Other Major Cities
  'Seattle, WA': 1.7,
  'Boston, MA': 1.8,
  'Washington, DC': 1.7,
  'Austin, TX': 1.4,
  'Denver, CO': 1.3,
  'Nashville, TN': 1.2,
  'Portland, OR': 1.5,
  'Phoenix, AZ': 1.2,
  'Las Vegas, NV': 1.3,
  'Default US': 1.0,
  
  // International Destinations
  'Paris, France': 2.2,
  'London, UK': 2.3,
  'Tokyo, Japan': 2.1,
  'Sydney, Australia': 2.0,
  'Vancouver, Canada': 1.8,
  'Toronto, Canada': 1.7,
  'Mexico City, Mexico': 1.2,
  'Cancun, Mexico': 1.4,
  'Tuscany, Italy': 2.0,
  'Rome, Italy': 1.9,
  'Barcelona, Spain': 1.8,
  'Santorini, Greece': 2.1,
  'Bali, Indonesia': 0.9,
  'Phuket, Thailand': 0.8,
  'Dubai, UAE': 2.2
}

// Base costs for a 100-person wedding
const baseCosts = {
  venue: 10000,
  catering: 12500,
  photography: 4000,
  attire: 3000,
  flowers: 3000,
  entertainment: 2500,
  stationery: 1000,
  favors: 1000,
  transportation: 1000
}

// Calculate minimum viable budget based on location and guest count
const calculateMinimumBudget = (
  guestCount: number,
  locationFactor: number,
  seasonalFactor: number
): number => {
  const baseTotal = Object.values(baseCosts).reduce((sum, cost) => sum + cost, 0)
  const guestFactor = Math.pow(guestCount / 100, 0.85) // Non-linear scaling for guest count
  return Math.round(baseTotal * locationFactor * guestFactor * seasonalFactor)
}

const isBrowser = typeof window !== 'undefined'

const validateBudgetData = (data: unknown): data is BudgetData => {
  if (!data || typeof data !== 'object') return false

  const budgetData = data as Partial<BudgetData>

  return (
    typeof budgetData.totalBudget === 'number' &&
    Array.isArray(budgetData.categories) &&
    typeof budgetData.lastUpdated === 'string' &&
    budgetData.location !== undefined &&
    typeof budgetData.guestCount === 'number' &&
    Array.isArray(budgetData.priorities) // Add check for priorities array
  )
}

const budgetStorage = {
  setBudgetData: (data: BudgetData) => {
    if (!isBrowser) {
      throw new BudgetError('Cannot access localStorage on server', 'SERVER_SIDE')
    }

    try {
      if (!validateBudgetData(data)) {
        console.error('Invalid budget data:', data) // Add debug logging
        throw new BudgetError('Invalid budget data format', 'INVALID_FORMAT')
      }

      localStorage.setItem('happilai_budget_data', JSON.stringify(data))
    } catch (error) {
      console.error('Budget storage error:', error) // Add debug logging
      if (error instanceof BudgetError) throw error
      throw new BudgetError(
        'Failed to save budget data: ' + (error instanceof Error ? error.message : 'Unknown error'),
        'SAVE_ERROR'
      )
    }
  },

  getBudgetData: (): BudgetData | null => {
    if (!isBrowser) {
      throw new BudgetError('Cannot access localStorage on server', 'SERVER_SIDE')
    }

    try {
      const data = localStorage.getItem('happilai_budget_data')
      if (!data) return null
      
      const parsed = JSON.parse(data)
      if (!validateBudgetData(parsed)) {
        throw new BudgetError('Invalid budget data format', 'INVALID_FORMAT')
      }
      
      return parsed
    } catch (error) {
      if (error instanceof BudgetError) throw error
      throw new BudgetError(
        'Failed to read budget data: ' + (error instanceof Error ? error.message : 'Unknown error'),
        'READ_ERROR'
      )
    }
  },

  clearBudgetData: () => {
    if (!isBrowser) {
      throw new BudgetError('Cannot access localStorage on server', 'SERVER_SIDE')
    }

    try {
      localStorage.removeItem('happilai_budget_data')
      localStorage.removeItem('budget_questionnaire_state')
      localStorage.removeItem('budget_preferences')
      sessionStorage.removeItem('budget_temp_data')
    } catch (error) {
      throw new BudgetError(
        'Failed to clear budget data: ' + (error instanceof Error ? error.message : 'Unknown error'),
        'CLEAR_ERROR'
      )
    }
  },

  calculateBudget: (
    guestCount: number,
    location: LocationData,
    priorities: string[]
  ): {
    categories: BudgetData['categories']
    rationale: BudgetData['rationale']
    suggestedBudget: number
  } => {
    try {
      if (!guestCount || guestCount < 0) {
        throw new BudgetError('Invalid guest count', 'INVALID_GUEST_COUNT')
      }
      
      if (!location || !location.city) {
        throw new BudgetError('Invalid location data', 'INVALID_LOCATION')
      }

      // Get location cost factor with more granular location matching
      const locationKey = location.state 
        ? `${location.city}, ${location.state}`
        : location.city
      
      // Try exact match first, then try partial matches
      let locationFactor = locationCostFactors[locationKey]
      if (!locationFactor) {
        // Try to match based on city name for suburbs
        const cityMatch = Object.keys(locationCostFactors).find(key => 
          key.toLowerCase().includes(location.city.toLowerCase())
        )
        locationFactor = cityMatch 
          ? locationCostFactors[cityMatch]
          : locationCostFactors['Default US']
      }

      // Calculate guest impact (non-linear scaling)
      const guestFactor = Math.pow(guestCount / 100, 0.85)

      // Calculate seasonal factor based on month
      // Peak season (June-September): 1.2x
      // Shoulder season (April-May, October): 1.1x
      // Off season (November-March): 1.0x
      const weddingDate = new Date(location.weddingDate || new Date())
      const month = weddingDate.getMonth()
      let seasonalFactor = 1.0
      if (month >= 5 && month <= 8) { // June-September
        seasonalFactor = 1.2
      } else if (month === 3 || month === 4 || month === 9) { // April-May, October
        seasonalFactor = 1.1
      }

      // Calculate minimum viable budget
      const suggestedBudget = calculateMinimumBudget(guestCount, locationFactor, seasonalFactor)

      // Adjust for priorities
      const priorityBoost = 1.3 // 30% increase for priority categories
      const categories = Object.entries(baseCosts).map(([category, baseCost]) => {
        const isPriority = priorities.includes(category)
        const adjustedCost = baseCost * locationFactor * guestFactor * seasonalFactor
        const finalCost = isPriority ? adjustedCost * priorityBoost : adjustedCost

        return {
          id: category,
          name: category.charAt(0).toUpperCase() + category.slice(1),
          percentage: (finalCost / suggestedBudget) * 100,
          estimatedCost: Math.round(finalCost),
          actualCost: 0,
          remaining: Math.round(finalCost),
          priority: isPriority ? 'high' : 'medium',
          rationale: `Based on ${guestCount} guests, ${location.city} pricing (${locationFactor.toFixed(2)}x base cost)${
            isPriority ? ', prioritized category (+30%)' : ''
          }`
        }
      })

      return {
        categories,
        rationale: {
          totalBudget: `$${Math.round(suggestedBudget).toLocaleString()}`,
          locationFactor,
          seasonalFactor,
          notes: [
            `Location factor: ${locationFactor.toFixed(2)}x (based on ${location.city})`,
            `Guest count adjustment: ${guestFactor.toFixed(2)}x (${guestCount} guests)`,
            `Seasonal factor: ${seasonalFactor}x (${
              seasonalFactor === 1.2 ? 'peak season' :
              seasonalFactor === 1.1 ? 'shoulder season' :
              'off season'
            })`,
            `Suggested budget based on local costs and factors`
          ]
        },
        suggestedBudget
      }
    } catch (error) {
      if (error instanceof BudgetError) throw error
      throw new BudgetError(
        'Failed to calculate budget: ' + (error instanceof Error ? error.message : 'Unknown error'),
        'CALCULATION_ERROR'
      )
    }
  }
}

export default budgetStorage

