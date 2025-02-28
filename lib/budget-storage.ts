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

// Define the category types
type CategoryType = 'venue' | 'catering' | 'photography' | 'attire' | 'flowers' | 'entertainment' | 'stationery' | 'favors' | 'transportation' | 'hair_makeup'

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
  notes: string
  description: string
  budgetingTips: string[]
  ranges?: {
    min: number
    max: number
  }
}

// Use BudgetCategoryDetail as our BudgetCategory type
type BudgetCategory = BudgetCategoryDetail

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
  transportation: { min: 800, typical: 1000, max: 2000 },
  hair_makeup: { min: 800, typical: 1200, max: 2000 }
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

// Define which percentage of each category scales with guest count
const guestCountScaling: Record<CategoryType, {
  fixed: number,  // Percentage that doesn't scale with guests
  variable: number, // Percentage that scales with guests
  staffing: number // Percentage that scales with staff needs
}> = {
  venue: { fixed: 0.7, variable: 0.2, staffing: 0.1 }, // Most venue cost is fixed rental
  catering: { fixed: 0.1, variable: 0.8, staffing: 0.1 }, // Mostly per-person
  photography: { fixed: 0.8, variable: 0.1, staffing: 0.1 }, // Mostly fixed package
  attire: { fixed: 1.0, variable: 0, staffing: 0 }, // Doesn't scale with guests
  flowers: { fixed: 0.4, variable: 0.6, staffing: 0 }, // Mix of fixed and per-table
  entertainment: { fixed: 0.8, variable: 0, staffing: 0.2 }, // Mostly fixed
  stationery: { fixed: 0.2, variable: 0.8, staffing: 0 }, // Scales with guest count
  favors: { fixed: 0.1, variable: 0.9, staffing: 0 }, // Almost entirely per-guest
  transportation: { fixed: 0.6, variable: 0.3, staffing: 0.1 } // Mix of fixed and variable
}

// Calculate staffing needs based on guest count
const calculateStaffingFactor = (guestCount: number): number => {
  if (guestCount <= 50) return 1.0
  if (guestCount <= 100) return 1.2
  if (guestCount <= 150) return 1.4
  if (guestCount <= 200) return 1.6
  if (guestCount <= 300) return 1.8
  return 2.0
}

// Calculate guest count scaling factor with diminishing returns
const calculateGuestFactor = (guestCount: number): number => {
  // Base scaling with strong diminishing returns
  return Math.pow(guestCount / 100, 0.7)
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
  budget?: number  // Add budget property
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

const COVERAGE_OPTIONS = ["Full Day Coverage", "Partial Day Coverage", "Ceremony & Portraits Only"] as const;

const isCoverage = (value: string): value is Coverage => {
  return COVERAGE_OPTIONS.includes(value as Coverage);
}

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

// Add category descriptions and cost breakdowns
const categoryDescriptions: Record<CategoryType, {
  description: string,
  costBreakdown: string,
  scalingExplanation: string,
  budgetingTips: string[]
}> = {
  venue: {
    description: "Includes the rental fee for your ceremony and reception spaces, plus basic amenities.",
    costBreakdown: "70% fixed rental fee, 20% setup and amenities, 10% staffing",
    scalingExplanation: "While the base rental fee stays fixed, setup costs increase with guest count, and you may need additional space or staff for larger events.",
    budgetingTips: [
      "Off-peak seasons can save 20-30%",
      "Friday or Sunday weddings often cost less",
      "All-inclusive venues can reduce overall costs",
      "Consider ceremony and reception at same location"
    ]
  },
  catering: {
    description: "Covers food, service, staffing, and basic rentals like plates and utensils.",
    costBreakdown: "10% fixed kitchen setup, 80% food and service, 10% staffing",
    scalingExplanation: "Food and service costs scale directly with guest count. Staffing increases in tiers (1 server per 25-30 guests).",
    budgetingTips: [
      "Buffet service can reduce costs by 20-30%",
      "Limiting alcohol options can save significantly",
      "Brunch or lunch weddings cost less than dinner",
      "Consider heavy appetizers instead of full meal"
    ]
  },
  photography: {
    description: "Professional photography services, including editing and final deliverables.",
    costBreakdown: "80% fixed base package, 10% prints/albums, 10% additional coverage",
    scalingExplanation: "Base package is fixed, but larger weddings may need second shooter or longer hours.",
    budgetingTips: [
      "Digital-only packages cost less than with prints",
      "Shorter coverage time can reduce costs",
      "Off-season discounts are often available",
      "Prioritize skill over fancy packaging"
    ]
  },
  attire: {
    description: "Wedding dress, accessories, alterations, and other wedding party attire.",
    costBreakdown: "100% fixed cost - doesn't scale with guest count",
    scalingExplanation: "Attire costs are independent of guest count but vary by style and designer.",
    budgetingTips: [
      "Sample sales can offer 40-70% savings",
      "Consider preowned or rental options",
      "Factor in alterations (usually 10-20% of dress cost)",
      "Watch for trunk show discounts"
    ]
  },
  flowers: {
    description: "Personal flowers, ceremony decor, and reception centerpieces.",
    costBreakdown: "40% fixed (ceremony, personal flowers), 60% reception decor",
    scalingExplanation: "Ceremony and personal flowers are fixed, while reception costs scale with guest count (more tables = more centerpieces).",
    budgetingTips: [
      "Use seasonal flowers to reduce costs",
      "Repurpose ceremony flowers at reception",
      "Mix fresh and silk flowers",
      "Choose hardy blooms that last longer"
    ]
  },
  entertainment: {
    description: "Music for ceremony and reception, including equipment rental.",
    costBreakdown: "80% fixed base rate, 20% additional equipment/staff",
    scalingExplanation: "Base rate is fixed, but larger spaces may need additional speakers or setup.",
    budgetingTips: [
      "DJs typically cost less than bands",
      "Early end time can reduce costs",
      "Consider ceremony musician separately",
      "Ask about package deals"
    ]
  },
  stationery: {
    description: "Save-the-dates, invitations, day-of paper goods, and postage.",
    costBreakdown: "20% fixed design costs, 80% printing and postage",
    scalingExplanation: "Design cost is fixed, but printing and postage scale directly with guest count.",
    budgetingTips: [
      "Digital RSVPs save on return postage",
      "Simplified designs cost less to print",
      "Buy in bulk for better rates",
      "Consider partial DIY approach"
    ]
  },
  favors: {
    description: "Guest gifts and welcome bags.",
    costBreakdown: "10% fixed setup, 90% per-guest items",
    scalingExplanation: "Almost entirely scales with guest count - each additional guest needs their own favor.",
    budgetingTips: [
      "Consider edible favors (less waste)",
      "Buy in bulk for discounts",
      "DIY can be cost-effective",
      "Skip individual packaging to save"
    ]
  },
  transportation: {
    description: "Wedding party transportation and guest shuttles if needed.",
    costBreakdown: "60% fixed base rates, 30% mileage/time, 10% staffing",
    scalingExplanation: "Base vehicle rates are fixed, but larger groups need more vehicles or trips.",
    budgetingTips: [
      "Limit shuttle service to key times",
      "Choose venues close together",
      "Book early for better rates",
      "Consider selective transportation"
    ]
  },
  hair_makeup: {
    description: "Professional hair styling and makeup services for the wedding party.",
    costBreakdown: "70% service costs, 20% products, 10% travel fees",
    scalingExplanation: "Costs scale with number of people receiving services and whether trials are included.",
    budgetingTips: [
      "Book trials strategically to save on travel fees",
      "Consider group discounts for larger parties",
      "Prioritize key members for professional services",
      "Book early for better availability and rates"
    ]
  }
}

// Calculate budget ranges based on all factors
const calculateBudgetRanges = (
  guestCount: number,
  locationFactor: number,
  seasonalFactor: number,
  totalBudget: number,
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
  categoryMultipliers: Record<CategoryType, number>
} => {
  const adjustments: string[] = []
  const categoryMultipliers: Record<CategoryType, number> = {
    venue: 1.0,
    catering: 1.0,
    photography: 1.0,
    attire: 1.0,
    flowers: 1.0,
    entertainment: 1.0,
    stationery: 1.0,
    favors: 1.0,
    transportation: 1.0,
    hair_makeup: 1.0
  }
  
  // Calculate base multipliers with caps
  const baseLocationFactor = Math.min(locationFactor, 2.0) // Cap location factor
  const baseSeasonalFactor = seasonalFactor // Already capped between 1.0-1.2
  const baseGuestFactor = calculateGuestFactor(guestCount)
  const baseStaffingFactor = calculateStaffingFactor(guestCount)

  // Calculate service style multipliers with realistic combinations
  const serviceMultipliersEffect = {
    venue: 1.0, // Venue is primarily affected by location and season
    catering: preferences.cateringStyle && isCateringStyle(preferences.cateringStyle) 
      ? (serviceMultipliers.catering[preferences.cateringStyle] * 0.7 + 0.3) // Weighted to prevent extreme variations
      : 1.0,
    photography: preferences.photoVideo && isPhotoVideo(preferences.photoVideo) && preferences.coverage && isCoverage(preferences.coverage)
      ? Math.min(
          // Take the higher of the two multipliers and add a small boost if both are high-end
          Math.max(
            serviceMultipliers.photography[preferences.photoVideo],
            serviceMultipliers.coverage[preferences.coverage]
          ) * 0.8 + 
          (serviceMultipliers.photography[preferences.photoVideo] > 1.2 && 
           serviceMultipliers.coverage[preferences.coverage] > 1.1 ? 0.2 : 0),
          1.8 // Hard cap on photography multiplier
        )
      : 1.0,
    flowers: preferences.floralStyle && isFloralStyle(preferences.floralStyle)
      ? (serviceMultipliers.florals[preferences.floralStyle] * 0.8 + 0.2) // Weighted to prevent extreme variations
      : 1.0,
    entertainment: preferences.musicChoice && isMusicChoice(preferences.musicChoice)
      ? Math.min(serviceMultipliers.music[preferences.musicChoice], 1.8) // Cap entertainment increase
      : 1.0,
    attire: 1.0, // Attire costs don't scale with other factors
    stationery: 1.0,
    favors: 1.0,
    transportation: 1.0,
    hair_makeup: 1.0
  }

  // First pass: Calculate initial multipliers for each category using weighted combinations
  const MAX_CATEGORY_MULTIPLIER = 2.0 // More conservative cap
  
  Object.keys(baseCosts).forEach((category) => {
    const cat = category as CategoryType
    
    // Use weighted averages instead of pure multiplication for more realistic scaling
    let totalMultiplier = 1.0
    
    // Location and seasonal factors (weighted)
    if (['venue', 'catering', 'transportation'].includes(cat)) {
      totalMultiplier *= (baseLocationFactor * 0.7 + baseSeasonalFactor * 0.3)
    } else {
      totalMultiplier *= (baseLocationFactor * 0.3 + 0.7) // Other categories less affected by location
    }
    
    // Service style multipliers
    totalMultiplier *= serviceMultipliersEffect[cat]
    
    // Guest count scaling (with diminishing returns)
    if (['venue', 'catering', 'transportation'].includes(cat)) {
      totalMultiplier *= (baseGuestFactor * 0.8 + 0.2) // Weighted to prevent extreme scaling
    }
    
    // Staffing factor (only where relevant)
    if (['catering', 'photography', 'entertainment'].includes(cat)) {
      totalMultiplier *= (baseStaffingFactor * 0.6 + 0.4) // Weighted to prevent extreme scaling
    }
    
    // Cap individual category multiplier
    if (totalMultiplier > MAX_CATEGORY_MULTIPLIER) {
      adjustments.push(`${cat.charAt(0).toUpperCase() + cat.slice(1)} costs were capped at ${MAX_CATEGORY_MULTIPLIER}x to maintain realistic pricing`)
      totalMultiplier = MAX_CATEGORY_MULTIPLIER
    }
    
    categoryMultipliers[cat] = totalMultiplier
  })

  // Calculate initial total cost
  let initialTotalCost = 0
  Object.keys(baseCosts).forEach((category) => {
    const cat = category as CategoryType
    initialTotalCost += baseCosts[cat].typical * categoryMultipliers[cat]
  })

  // Second pass: Scale all categories to fit within total budget
  if (initialTotalCost > totalBudget) {
    const scalingFactor = totalBudget / initialTotalCost
    adjustments.push(`Adjusted all costs down by ${Math.round((1 - scalingFactor) * 100)}% to meet target budget of ${formatCurrency(totalBudget)}`)
    
    Object.keys(categoryMultipliers).forEach((category) => {
      categoryMultipliers[category as CategoryType] *= scalingFactor
    })
  }

  // Calculate final ranges using scaled multipliers
  const min = Object.keys(baseCosts).reduce((sum, category) => {
    const cat = category as CategoryType
    return sum + (baseCosts[cat].min * categoryMultipliers[cat])
  }, 0)

  const typical = Object.keys(baseCosts).reduce((sum, category) => {
    const cat = category as CategoryType
    return sum + (baseCosts[cat].typical * categoryMultipliers[cat])
  }, 0)

  const max = Object.keys(baseCosts).reduce((sum, category) => {
    const cat = category as CategoryType
    return sum + (baseCosts[cat].max * categoryMultipliers[cat])
  }, 0)

  return {
    min,
    typical,
    max,
    adjustments,
    categoryMultipliers
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
        location.budget || calculateMinimumBudget(guestCount, locationFactor, seasonalFactor),
        preferences || {}
      )

      // Use the typical range as the suggested budget
      const suggestedBudget = budgetRanges.typical

      // Create categories with ranges
      const categories: BudgetCategory[] = Object.entries(baseCosts).map(([name, ranges]) => {
        const percentage = ranges.typical / Object.values(baseCosts).reduce((sum, r) => sum + r.typical, 0)
        const estimatedCost = Math.round(suggestedBudget * percentage)
        const categoryInfo = categoryDescriptions[name as CategoryType]
        
        const priority: 'high' | 'medium' | 'low' = priorities.includes(name) ? 'high' : 'medium'
        
        const category: BudgetCategory = {
          id: name.toLowerCase(),
          name: name.charAt(0).toUpperCase() + name.slice(1),
          percentage: Math.round(percentage * 100),
          estimatedCost,
          actualCost: 0,
          remaining: estimatedCost,
          priority,
          rationale: categoryInfo.description,
          notes: categoryInfo.costBreakdown,
          description: categoryInfo.scalingExplanation,
          budgetingTips: categoryInfo.budgetingTips
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

