import type { BudgetData } from '@/types/budget'

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

type BudgetCategory = 'venue' | 'catering' | 'photography' | 'attire' | 'flowers' | 'entertainment' | 'stationery' | 'favors' | 'transportation'

// Change the local type name to avoid collision
type CategoryType = 'venue' | 'catering' | 'photography' | 'attire' | 'flowers' | 'entertainment' | 'stationery' | 'favors' | 'transportation'

interface CostRange {
  min: number
  typical: number
  max: number
}

// Use the new type name
type CategoryName = CategoryType

interface BudgetCategoryDetail {
  id: string
  name: string
  percentage: number
  estimatedCost: number
  actualCost: number
  remaining: number
  priority: Priority
  rationale: string
  ranges: {
    min: number
    max: number
  }
}

// Update the baseCosts type
const baseCosts: Record<CategoryType, CostRange> = {
  venue: { min: 8000, typical: 10000, max: 15000 },
  catering: { min: 10000, typical: 12500, max: 18000 },
  photography: { min: 3000, typical: 4000, max: 6000 },
  attire: { min: 2000, typical: 3000, max: 4500 },
  flowers: { min: 2000, typical: 3000, max: 5000 },
  entertainment: { min: 1800, typical: 2500, max: 4000 },
  stationery: { min: 800, typical: 1000, max: 1500 },
  favors: { min: 800, typical: 1000, max: 1500 },
  transportation: { min: 800, typical: 1000, max: 2000 }
}

type CateringStyle = 'Plated' | 'Buffet' | 'Family Style' | 'Food Stations' | 'Heavy Appetizers'
type BarService = 'Full Open Bar' | 'Beer & Wine Only' | 'Limited Open Bar' | 'Cash Bar' | 'No Alcohol'
type PhotoVideo = 'Both Photography & Videography' | 'Photography Only' | 'Videography Only'
type Coverage = 'Full Day Coverage' | 'Partial Day Coverage' | 'Ceremony & Portraits Only'
type FloralStyle = 'Elaborate & Luxurious' | 'Modern & Minimalist' | 'Garden Style' | 'Wildflower Style' | 'Simple & Classic'
type DiyElements = 'Yes, planning DIY elements' | 'No DIY elements planned' | 'Maybe, still deciding'
type MusicChoice = 'DJ' | 'Live Band' | 'Both DJ & Band' | 'Other Live Music' | 'Playlist Only'
type BeautyCoverage = 'Full Wedding Party' | 'Bride Only' | 'Bride & Bridesmaids' | 'None Needed'
type PlannerType = 'Full Wedding Planner' | 'Month-of Coordinator' | 'Day-of Coordinator' | 'No Professional Help'

interface ServiceMultipliers {
  catering: Record<CateringStyle, number>
  bar: Record<BarService, number>
  photography: Record<PhotoVideo, number>
  coverage: Record<Coverage, number>
  florals: Record<FloralStyle, number>
  diy: Record<DiyElements, number>
  music: Record<MusicChoice, number>
  beauty: Record<BeautyCoverage, number>
  planner: Record<PlannerType, number>
}

const serviceMultipliers: ServiceMultipliers = {
  catering: {
    'Plated': 1.3,
    'Buffet': 1.0,
    'Family Style': 1.2,
    'Food Stations': 1.15,
    'Heavy Appetizers': 0.8
  },
  bar: {
    'Full Open Bar': 1.3,
    'Beer & Wine Only': 0.8,
    'Limited Open Bar': 1.0,
    'Cash Bar': 0.3,
    'No Alcohol': 0
  },
  photography: {
    'Both Photography & Videography': 1.5,
    'Photography Only': 1.0,
    'Videography Only': 0.8
  },
  coverage: {
    'Full Day Coverage': 1.2,
    'Partial Day Coverage': 1.0,
    'Ceremony & Portraits Only': 0.7
  },
  florals: {
    'Elaborate & Luxurious': 1.5,
    'Modern & Minimalist': 0.9,
    'Garden Style': 1.2,
    'Wildflower Style': 1.0,
    'Simple & Classic': 0.8
  },
  diy: {
    'Yes, planning DIY elements': 0.7,
    'No DIY elements planned': 1.0,
    'Maybe, still deciding': 0.9
  },
  music: {
    'DJ': 1.0,
    'Live Band': 1.8,
    'Both DJ & Band': 2.0,
    'Other Live Music': 1.5,
    'Playlist Only': 0.2
  },
  beauty: {
    'Full Wedding Party': 1.5,
    'Bride Only': 1.0,
    'Bride & Bridesmaids': 1.3,
    'None Needed': 0
  },
  planner: {
    'Full Wedding Planner': 1.5,
    'Month-of Coordinator': 1.0,
    'Day-of Coordinator': 0.8,
    'No Professional Help': 0
  }
}

// Calculate minimum viable budget based on location and guest count
const calculateMinimumBudget = (
  guestCount: number,
  locationFactor: number,
  seasonalFactor: number
): number => {
  // Calculate minimum budget using the min values from baseCosts
  const baseTotal = Object.values(baseCosts).reduce((sum, cost) => sum + cost.min, 0)
  const guestFactor = Math.pow(guestCount / 100, 0.85)
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

// City name variations mapping
const cityVariations: Record<string, string[]> = {
  'New York': ['nyc', 'new york city', 'manhattan'],
  'Los Angeles': ['la', 'l.a.'],
  'San Francisco': ['sf', 'san fran'],
  'Chicago': ['chi-town'],
  'Las Vegas': ['vegas'],
  'Washington': ['washington dc', 'dc', 'd.c.', 'district of columbia'],
  'Atlanta': ['atl'],
  'Miami': ['south beach'],
}

// Normalize city name
const normalizeCity = (city: string): string => {
  const lowercaseCity = city.toLowerCase().trim()
  
  // Check if this is a known variation
  for (const [mainCity, variations] of Object.entries(cityVariations)) {
    if (variations.includes(lowercaseCity) || lowercaseCity === mainCity.toLowerCase()) {
      return mainCity
    }
  }
  
  return city
}

// Ensure Priority type is defined before use
type Priority = 'high' | 'medium' | 'low'

export interface LocationData {
  city: string
  state?: string
  country?: string
  isDestination?: boolean
  weddingDate?: string
}

// Calculate seasonal factor based on wedding date
const calculateSeasonalFactor = (date: Date): number => {
  const month = date.getMonth()
  // Peak season (June-September): 1.2x
  if (month >= 5 && month <= 8) return 1.2
  // Shoulder season (April-May, October): 1.1x
  if (month === 3 || month === 4 || month === 9) return 1.1
  // Off season (November-March): 1.0x
  return 1.0
}

// Type guard functions
const isCateringStyle = (value: string): value is CateringStyle => 
  Object.keys(serviceMultipliers.catering).includes(value)

const isBarService = (value: string): value is BarService =>
  Object.keys(serviceMultipliers.bar).includes(value)

const isPhotoVideo = (value: string): value is PhotoVideo =>
  Object.keys(serviceMultipliers.photography).includes(value)

const isCoverage = (value: string): value is Coverage =>
  Object.keys(serviceMultipliers.coverage).includes(value)

const isFloralStyle = (value: string): value is FloralStyle =>
  Object.keys(serviceMultipliers.florals).includes(value)

const isDiyElements = (value: string): value is DiyElements =>
  Object.keys(serviceMultipliers.diy).includes(value)

const isMusicChoice = (value: string): value is MusicChoice =>
  Object.keys(serviceMultipliers.music).includes(value)

const isBeautyCoverage = (value: string): value is BeautyCoverage =>
  Object.keys(serviceMultipliers.beauty).includes(value)

const isPlannerType = (value: string): value is PlannerType =>
  Object.keys(serviceMultipliers.planner).includes(value)

// Calculate budget ranges based on all factors
const calculateBudgetRanges = (
  guestCount: number,
  locationFactor: number,
  seasonalFactor: number,
  preferences: {
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
): {
  min: number
  typical: number
  max: number
  adjustments: string[]
} => {
  const adjustments: string[] = []
  const totals = { min: 0, typical: 0, max: 0 }
  
  // Calculate base ranges with guest count scaling
  const guestFactor = Math.pow(guestCount / 100, 0.85)
  
  // Calculate totals with all multipliers
  Object.entries(baseCosts).forEach(([category, ranges]) => {
    const categoryKey = category as CategoryName
    const multipliedRanges = {
      min: ranges.min,
      typical: ranges.typical,
      max: ranges.max
    }

    // Apply specific multipliers based on category
    switch(categoryKey) {
      case 'catering':
        if (preferences.cateringStyle && isCateringStyle(preferences.cateringStyle)) {
          const multiplier = serviceMultipliers.catering[preferences.cateringStyle]
          multipliedRanges.min *= multiplier
          multipliedRanges.typical *= multiplier
          multipliedRanges.max *= multiplier
          adjustments.push(`Applied ${preferences.cateringStyle} catering style (${multiplier}x)`)
        }
        if (preferences.barService && isBarService(preferences.barService)) {
          const multiplier = serviceMultipliers.bar[preferences.barService]
          multipliedRanges.min *= (1 + multiplier)
          multipliedRanges.typical *= (1 + multiplier)
          multipliedRanges.max *= (1 + multiplier)
          adjustments.push(`Added ${preferences.barService} service (${multiplier}x)`)
        }
        break
      case 'photography':
        if (preferences.photoVideo && isPhotoVideo(preferences.photoVideo)) {
          const multiplier = serviceMultipliers.photography[preferences.photoVideo]
          multipliedRanges.min *= multiplier
          multipliedRanges.typical *= multiplier
          multipliedRanges.max *= multiplier
          adjustments.push(`Applied ${preferences.photoVideo} photography coverage (${multiplier}x)`)
        }
        if (preferences.coverage && isCoverage(preferences.coverage)) {
          const coverageMultiplier = serviceMultipliers.coverage[preferences.coverage]
          multipliedRanges.min *= coverageMultiplier
          multipliedRanges.typical *= coverageMultiplier
          multipliedRanges.max *= coverageMultiplier
          adjustments.push(`Applied ${preferences.coverage} coverage (${coverageMultiplier}x)`)
        }
        break
      case 'flowers':
        if (preferences.floralStyle && isFloralStyle(preferences.floralStyle)) {
          const multiplier = serviceMultipliers.florals[preferences.floralStyle]
          multipliedRanges.min *= multiplier
          multipliedRanges.typical *= multiplier
          multipliedRanges.max *= multiplier
          adjustments.push(`Applied ${preferences.floralStyle} floral style (${multiplier}x)`)
        }
        if (preferences.diyElements && isDiyElements(preferences.diyElements)) {
          const diyMultiplier = serviceMultipliers.diy[preferences.diyElements]
          multipliedRanges.min *= diyMultiplier
          multipliedRanges.typical *= diyMultiplier
          multipliedRanges.max *= diyMultiplier
          adjustments.push(`Applied ${preferences.diyElements} DIY elements (${diyMultiplier}x)`)
        }
        break
      case 'entertainment':
        if (preferences.musicChoice && isMusicChoice(preferences.musicChoice)) {
          const multiplier = serviceMultipliers.music[preferences.musicChoice]
          multipliedRanges.min *= multiplier
          multipliedRanges.typical *= multiplier
          multipliedRanges.max *= multiplier
          adjustments.push(`Applied ${preferences.musicChoice} music choice (${multiplier}x)`)
        }
        break
      case 'attire':
        if (preferences.beautyCoverage && isBeautyCoverage(preferences.beautyCoverage)) {
          const multiplier = serviceMultipliers.beauty[preferences.beautyCoverage]
          multipliedRanges.min *= (1 + multiplier * 0.3)
          multipliedRanges.typical *= (1 + multiplier * 0.3)
          multipliedRanges.max *= (1 + multiplier * 0.3)
          adjustments.push(`Added ${preferences.beautyCoverage} beauty coverage (${multiplier}x)`)
        }
        break
      default:
        // No special multipliers for other categories
        break
    }

    // Apply guest count, location, and seasonal factors
    multipliedRanges.min *= guestFactor * locationFactor * seasonalFactor
    multipliedRanges.typical *= guestFactor * locationFactor * seasonalFactor
    multipliedRanges.max *= guestFactor * locationFactor * seasonalFactor

    totals.min += Math.round(multipliedRanges.min)
    totals.typical += Math.round(multipliedRanges.typical)
    totals.max += Math.round(multipliedRanges.max)
  })

  return {
    min: totals.min,
    typical: totals.typical,
    max: totals.max,
    adjustments
  }
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
    priorities: string[],
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
  ): {
    categories: BudgetCategory[]
    rationale: BudgetData['rationale']
    suggestedBudget: number
    ranges: {
      min: number
      typical: number
      max: number
    }
  } => {
    try {
      if (!guestCount || guestCount < 0) {
        throw new BudgetError('Invalid guest count', 'INVALID_GUEST_COUNT')
      }
      
      if (!location || !location.city) {
        throw new BudgetError('Invalid location', 'INVALID_LOCATION')
      }

      // Normalize the city name
      const normalizedCity = normalizeCity(location.city)
      
      // Get location cost factor with more granular location matching
      const locationKey = location.state 
        ? `${normalizedCity}, ${location.state}`
        : normalizedCity
      
      // Try exact match first, then try partial matches
      let locationFactor = locationCostFactors[locationKey]
      if (!locationFactor) {
        const cityMatch = Object.keys(locationCostFactors).find(key => 
          key.toLowerCase().includes(normalizedCity.toLowerCase())
        )
        locationFactor = cityMatch 
          ? locationCostFactors[cityMatch]
          : locationCostFactors['Default US']
      }

      // Calculate seasonal factor based on wedding date if available
      const seasonalFactor = location.weddingDate 
        ? calculateSeasonalFactor(new Date(location.weddingDate))
        : 1.0

      // Calculate budget ranges with all factors
      const budgetRanges = calculateBudgetRanges(
        guestCount,
        locationFactor,
        seasonalFactor,
        preferences || {}
      )

      // Use the typical range as the suggested budget
      const suggestedBudget = budgetRanges.typical

      // Create categories with ranges
      const categories: BudgetCategory[] = Object.entries(baseCosts).map(([name, ranges]) => {
        const percentage = ranges.typical / Object.values(baseCosts).reduce((sum, r) => sum + r.typical, 0)
        const estimatedCost = Math.round(suggestedBudget * percentage)
        
        const priority: 'high' | 'medium' | 'low' = priorities.includes(name) ? 'high' : 'medium'
        
        const category: BudgetCategory = {
          id: name.toLowerCase(),
          name: name.charAt(0).toUpperCase() + name.slice(1),
          percentage: Math.round(percentage * 100),
          estimatedCost,
          actualCost: 0,
          remaining: estimatedCost,
          priority,
          rationale: `Based on ${guestCount} guests and ${location.city} pricing`,
          notes: `Range: $${Math.round(budgetRanges.min * percentage).toLocaleString()} - $${Math.round(budgetRanges.max * percentage).toLocaleString()}`
        }
        
        return category
      })

      return {
        categories,
        rationale: {
          totalBudget: `Suggested budget range: ${formatCurrency(budgetRanges.min)} - ${formatCurrency(budgetRanges.max)}`,
          locationFactor,
          seasonalFactor,
          notes: budgetRanges.adjustments
        },
        suggestedBudget,
        ranges: {
          min: budgetRanges.min,
          typical: budgetRanges.typical,
          max: budgetRanges.max
        }
      }
    } catch (error) {
      console.error('Budget calculation error:', error)
      throw error
    }
  }
}

// Helper function for currency formatting
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

export default budgetStorage

