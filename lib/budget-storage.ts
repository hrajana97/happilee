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
  hair_makeup: { min: 1500, typical: 2500, max: 4000 }
}

// Export types
export type CateringStyle = 'Plated' | 'Buffet' | 'Family Style' | 'Food Stations' | 'Heavy Appetizers'
export type BarService = 'Full Open Bar' | 'Beer & Wine Only' | 'Limited Open Bar' | 'Cash Bar' | 'No Alcohol'
export type PhotoVideo = 'Both Photography & Videography' | 'Photography Only' | 'Videography Only'
export type Coverage = 'Full Day Coverage' | 'Partial Day Coverage' | 'Ceremony & Portraits Only'
export type FloralStyle = 'Fresh' | 'Artificial' | 'Mixed'
export type WeddingPartySize = 'Small (1-4 people)' | 'Medium (5-8 people)' | 'Large (9+ people)'
export type CeremonyDecorLevel = 'Minimal' | 'Standard' | 'Elaborate'
export type AdditionalDecorAreas = 'None' | 'Some' | 'Extensive'
export type DiyElements = 'Yes, planning DIY elements' | 'No DIY elements planned' | 'Maybe, still deciding'
export type MusicChoice = 'DJ' | 'Live Band' | 'Both DJ & Band' | 'Other Live Music' | 'Playlist Only'
export type BeautyStyle = 'DIY' | 'Bride Only' | 'Bride and Party'
export type StationeryType = 'Digital' | 'Print' | 'Both'
export type SaveTheDateType = 'digital' | 'printed' | 'none'
export type InvitationType = 'digital' | 'printed' | 'both'
export type TransportationType = 'None' | 'Venue to Venue' | 'Hotel to Venue' | 'Both'
export type PlannerType = 'Full Wedding Planner' | 'Month-of Coordinator' | 'Day-of Coordinator' | 'No Professional Help'
export type EntertainmentType = 'live music' | 'no live - will use recorded track' | 'none'
export type BeautyCoverage = 'Full Wedding Party' | 'Bride Only' | 'Bride & Bridesmaids' | 'None Needed'

interface ServiceMultipliers {
  catering: Record<CateringStyle, number>
  bar: Record<BarService, number>
  photography: Record<PhotoVideo, number>
  coverage: Record<Coverage, number>
  florals: Record<FloralStyle, number>
  diy: Record<DiyElements, number>
  music: Record<MusicChoice, number>
  beauty: Record<BeautyStyle, number>
  planner: Record<PlannerType, number>
  transportation: Record<TransportationType, number>
  stationery: Record<StationeryType, number>
  saveTheDate: Record<SaveTheDateType, number>
  entertainment: Record<EntertainmentType, number>
}

interface FloralMultipliers {
  style: Record<FloralStyle, number>
  partySize: Record<WeddingPartySize, number>
  ceremonyDecor: Record<CeremonyDecorLevel, number>
  additionalDecor: Record<AdditionalDecorAreas, number>
}

const floralMultipliers: FloralMultipliers = {
  style: {
    'Fresh': 1.0,
    'Artificial': 0.7,
    'Mixed': 0.85
  },
  partySize: {
    'Small (1-4 people)': 0.8,
    'Medium (5-8 people)': 1.0,
    'Large (9+ people)': 1.3
  },
  ceremonyDecor: {
    'Minimal': 0.7,
    'Standard': 1.0,
    'Elaborate': 1.4
  },
  additionalDecor: {
    'None': 0.8,
    'Some': 1.0,
    'Extensive': 1.3
  }
}

// Export service multipliers
export const serviceMultipliers: ServiceMultipliers = {
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
    'Fresh': 1.0,
    'Artificial': 0.7,
    'Mixed': 0.85
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
    'DIY': 0.2,
    'Bride Only': 1.0,
    'Bride and Party': 1.5
  },
  planner: {
    'Full Wedding Planner': 1.5,
    'Month-of Coordinator': 1.0,
    'Day-of Coordinator': 0.8,
    'No Professional Help': 0
  },
  transportation: {
    'None': 0,
    'Venue to Venue': 1.0,
    'Hotel to Venue': 1.2,
    'Both': 1.5
  },
  stationery: {
    'Digital': 0.7,
    'Print': 1.2,
    'Both': 1.5
  },
  saveTheDate: {
    'digital': 0.3,
    'printed': 0.5,
    'none': 0
  },
  entertainment: {
    'live music': 1.5,
    'no live - will use recorded track': 0.7,
    'none': 0
  }
}

// Define which percentage of each category scales with guest count
const guestCountScaling: Record<CategoryType, {
  fixed: number,
  variable: number,
  staffing: number
}> = {
  venue: { fixed: 0.7, variable: 0.2, staffing: 0.1 },
  catering: { fixed: 0.1, variable: 0.8, staffing: 0.1 },
  photography: { fixed: 0.8, variable: 0.1, staffing: 0.1 },
  attire: { fixed: 1.0, variable: 0, staffing: 0 },
  flowers: { fixed: 0.3, variable: 0.6, staffing: 0.1 },
  entertainment: { fixed: 0.8, variable: 0, staffing: 0.2 },
  stationery: { fixed: 0.2, variable: 0.8, staffing: 0 },
  favors: { fixed: 0.1, variable: 0.9, staffing: 0 },
  transportation: { fixed: 0.6, variable: 0.3, staffing: 0.1 },
  hair_makeup: { fixed: 0.2, variable: 0.7, staffing: 0.1 }
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
  zipCode?: string
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
  ['Fresh', 'Artificial', 'Mixed'].includes(value)

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
  scalingExplanation: string
}> = {
  venue: {
    description: "Includes rental fees for ceremony and/or reception spaces, based on your venue choices and whether you're using separate venues.",
    costBreakdown: "60% base venue rental, 25% setup and amenities, 15% staffing and coordination",
    scalingExplanation: "Costs vary significantly based on whether you choose separate venues for ceremony and reception. Setup and staffing costs increase with guest count."
  },
  catering: {
    description: "Food service and bar package based on your selected style and preferences.",
    costBreakdown: "Cost Distribution: Food (60%), Bar (25%), Staff & Rentals (15%)",
    scalingExplanation: "Costs based on guest count, service style, and bar package."
  },
  photography: {
    description: "Professional photo and/or video coverage based on your selected services and coverage duration.",
    costBreakdown: "Base package varies by service type:\n- Photography Only: $3000-4500\n- Videography Only: $2500-4000\n- Both: $5000-7500\nCoverage duration affects final cost:\n- Full Day (8-10 hrs): Base rate\n- Partial Day (6 hrs): -20%\n- Ceremony/Portraits (4 hrs): -40%",
    scalingExplanation: "Final cost is determined by:\n1. Service choice (photo/video/both)\n2. Coverage duration\n3. Location factor (travel fees may apply)\n4. Guest count (affects coverage needs)"
  },
  attire: {
    description: "Wedding attire costs based on your specified budgets for dress, suits, and accessories, including any alterations or reception dress if needed.",
    costBreakdown: "Total cost calculated from:\n- Main dress budget (custom or off-rack)\n- Suit budget × number of suits\n- Accessories budget\n- Reception dress (if selected)\n- Alterations (if needed, typically adds 15-20%)",
    scalingExplanation: "Final cost is the sum of all specified budgets, with alterations calculated as a percentage when selected. Custom dresses typically cost 30-50% more than off-rack."
  },
  flowers: {
    description: "Floral arrangements based on your chosen style, wedding party size, and decor preferences.",
    costBreakdown: "30% personal flowers (based on party size), 40% ceremony decor (by chosen level), 30% reception decor (by area count)",
    scalingExplanation: "Costs vary by floral style (fresh/artificial/mixed), wedding party size, ceremony decor level, and number of additional decor areas."
  },
  entertainment: {
    description: "Music for ceremony and reception based on your selected options and duration.",
    costBreakdown: "40% ceremony music, 60% reception entertainment (varies by choice)",
    scalingExplanation: "Base rate varies by music choice (DJ, band, both, or other) and number of hours needed."
  },
  stationery: {
    description: "Wedding stationery based on your chosen type (digital, print, or both).",
    costBreakdown: "25% design costs, 75% printing and distribution (varies by type)",
    scalingExplanation: "Costs scale with guest count and chosen stationery type. Digital options reduce per-guest costs significantly."
  },
  favors: {
    description: "Optional guest favors based on your preference and per-person budget.",
    costBreakdown: "90% favor items (based on per-person cost), 10% packaging and setup",
    scalingExplanation: "Costs scale directly with guest count and chosen per-person favor budget. Optional category that can be eliminated."
  },
  transportation: {
    description: "Guest shuttle services between hotel and venue, or between ceremony and reception venues.",
    costBreakdown: "Costs based on service type: hotel-to-venue (100%), venue-to-venue (100%), or both (150%). Includes vehicle rental and staffing.",
    scalingExplanation: "Cost varies by number of guests needing transport and number of trips/locations."
  },
  hair_makeup: {
    description: "Professional hair and makeup services for the bride and optional wedding party coverage.",
    costBreakdown: "Base cost varies by choice: DIY (20% of typical), bride only (100%), or bride with party (150%). Additional costs include products (25%) and travel fees (15%).",
    scalingExplanation: "Costs vary based on number of people and service type (DIY, bride only, or full party)."
  }
}

// Add type guards before calculateFloralMultiplier
const isWeddingPartySize = (value: string): value is WeddingPartySize =>
  ['Small (1-4 people)', 'Medium (5-8 people)', 'Large (9+ people)'].includes(value)

const isCeremonyDecorLevel = (value: string): value is CeremonyDecorLevel =>
  ['Minimal', 'Standard', 'Elaborate'].includes(value)

const isAdditionalDecorAreas = (value: string): value is AdditionalDecorAreas =>
  ['None', 'Some', 'Extensive'].includes(value)

// Update the preferences interface to handle both string and specific types
interface BudgetPreferences {
  cateringStyle?: string
  barService?: string
  photoVideo?: string
  coverage?: string
  floralStyle?: string | FloralStyle
  weddingPartySize?: string | WeddingPartySize
  ceremonyDecorLevel?: string | CeremonyDecorLevel
  additionalDecorAreas?: string | AdditionalDecorAreas
  diyElements?: string
  musicChoice?: string
  transportationType?: string | TransportationType
  stationeryType?: string | StationeryType
  beautyStyle?: string | BeautyStyle
  bridesmaidCount?: string
  includeFavors?: boolean
  favorCostPerPerson?: string
  saveTheDate?: SaveTheDateType
  invitationType?: InvitationType
  dressBudget?: string
  suitBudget?: string
  accessoriesBudget?: string
  needReceptionDress?: boolean
  receptionDressBudget?: string
}

// Calculate the combined floral multiplier
const calculateFloralMultiplier = (
  style: FloralStyle,
  partySize: WeddingPartySize,
  ceremonyDecor: CeremonyDecorLevel,
  additionalDecor: AdditionalDecorAreas
): number => {
  const styleMultiplier = floralMultipliers.style[style]
  const partySizeMultiplier = floralMultipliers.partySize[partySize]
  const ceremonyMultiplier = floralMultipliers.ceremonyDecor[ceremonyDecor]
  const additionalMultiplier = floralMultipliers.additionalDecor[additionalDecor]

  // Weight the components based on their typical proportion of the total floral budget
  const weightedMultiplier = 
    (styleMultiplier * 0.3) +           // Style affects all flowers
    (partySizeMultiplier * 0.2) +       // Personal flowers (bouquets, boutonnieres)
    (ceremonyMultiplier * 0.3) +        // Ceremony decor
    (additionalMultiplier * 0.2)        // Additional decor areas

  // Cap the maximum multiplier at 2.0 to prevent extreme variations
  return Math.min(weightedMultiplier, 2.0)
}

// Calculate budget ranges based on all factors
const calculateBudgetRanges = (
  guestCount: number,
  locationFactor: number,
  seasonalFactor: number,
  totalBudget: number,
  preferences: BudgetPreferences
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

  // Special handling for attire - use exact sum of individual items
  const attireTotalCost = (() => {
    let total = 0;
    if (preferences.dressBudget) {
      total += parseFloat(preferences.dressBudget.replace(/[^0-9.]/g, '')) || 0;
    }
    if (preferences.suitBudget) {
      total += parseFloat(preferences.suitBudget.replace(/[^0-9.]/g, '')) || 0;
    }
    if (preferences.accessoriesBudget) {
      total += parseFloat(preferences.accessoriesBudget.replace(/[^0-9.]/g, '')) || 0;
    }
    if (preferences.needReceptionDress && preferences.receptionDressBudget) {
      total += parseFloat(preferences.receptionDressBudget.replace(/[^0-9.]/g, '')) || 0;
    }
    return total;
  })();

  // Calculate service style multipliers with realistic combinations
  const serviceMultipliersEffect = {
    venue: 1.0,
    catering: preferences.cateringStyle && isCateringStyle(preferences.cateringStyle) 
      ? (serviceMultipliers.catering[preferences.cateringStyle] * 0.7 + 0.3)
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
    flowers: (() => {
      if (!preferences.floralStyle) return 1.0;

      // Validate all floral-related inputs
      if (!isFloralStyle(preferences.floralStyle)) return 1.0;
      
      const partySize = preferences.weddingPartySize && isWeddingPartySize(preferences.weddingPartySize) 
        ? preferences.weddingPartySize 
        : 'Medium (5-8 people)';
        
      const ceremonyDecor = preferences.ceremonyDecorLevel && isCeremonyDecorLevel(preferences.ceremonyDecorLevel)
        ? preferences.ceremonyDecorLevel
        : 'Standard';
        
      const additionalDecor = preferences.additionalDecorAreas && isAdditionalDecorAreas(preferences.additionalDecorAreas)
        ? preferences.additionalDecorAreas
        : 'Some';

      // Calculate the combined floral multiplier using all available preferences
      const combinedMultiplier = calculateFloralMultiplier(
        preferences.floralStyle,
        partySize,
        ceremonyDecor,
        additionalDecor
      );

      // Add explanatory notes for significant adjustments
      if (combinedMultiplier > 1.2) {
        adjustments.push(`Increased floral budget due to ${ceremonyDecor.toLowerCase()} ceremony decor and ${additionalDecor.toLowerCase()} additional decor areas`);
      } else if (combinedMultiplier < 0.8) {
        adjustments.push(`Reduced floral budget based on ${preferences.floralStyle.toLowerCase()} flowers and minimal decor selections`);
      }

      return combinedMultiplier;
    })(),
    entertainment: preferences.musicChoice && isMusicChoice(preferences.musicChoice)
      ? Math.min(serviceMultipliers.music[preferences.musicChoice], 1.8) // Cap entertainment increase
      : 1.0,
    attire: attireTotalCost > 0 ? (attireTotalCost / baseCosts.attire.typical) : 1.0,
    stationery: (() => {
      if (!preferences.stationeryType || !preferences.saveTheDate) return 1.0;
      
      const stationeryMultiplier = serviceMultipliers.stationery[preferences.stationeryType as StationeryType] || 1.0;
      const saveTheDateMultiplier = serviceMultipliers.saveTheDate[preferences.saveTheDate as SaveTheDateType] || 0;
      
      // Combine both multipliers with weighted average
      const combinedMultiplier = (stationeryMultiplier * 0.7) + (saveTheDateMultiplier * 0.3);
      
      if (combinedMultiplier !== 1.0) {
        adjustments.push(`Adjusted stationery budget for ${preferences.stationeryType} invitations and ${preferences.saveTheDate} save-the-dates`);
      }
      
      return combinedMultiplier;
    })(),
    favors: (() => {
      if (!preferences.includeFavors) {
        adjustments.push('No budget allocated for favors as per preference');
        return 0;
      }
      
      if (!preferences.favorCostPerPerson) return 1.0;
      
      const costPerPerson = parseFloat(preferences.favorCostPerPerson);
      if (isNaN(costPerPerson)) return 1.0;
      
      // Base the multiplier on the per-person cost relative to a typical $5 favor
      const baseMultiplier = costPerPerson / 5;
      const finalMultiplier = Math.min(Math.max(baseMultiplier, 0.2), 2.0); // Cap between 0.2x and 2.0x
      
      adjustments.push(`Adjusted favors budget for ${guestCount} guests at $${costPerPerson.toFixed(2)} per person`);
      
      return finalMultiplier;
    })(),
    transportation: (() => {
      if (!preferences.transportationType || !isTransportationType(preferences.transportationType)) return 0;
      
      const baseMultiplier = serviceMultipliers.transportation[preferences.transportationType];
      const guestCountFactor = Math.ceil(guestCount / 50) * 0.1; // Additional 10% per 50 guests
      
      const finalMultiplier = Math.min(baseMultiplier * (1 + guestCountFactor), 2.0);
      
      if (finalMultiplier > 1.2) {
        adjustments.push(`Increased transportation budget due to ${preferences.transportationType.toLowerCase()} needs and guest count of ${guestCount}`);
      }
      
      return finalMultiplier;
    })(),
    hair_makeup: (() => {
      if (!preferences.beautyStyle || !isBeautyStyle(preferences.beautyStyle)) return 1.0;
      
      const baseMultiplier = serviceMultipliers.beauty[preferences.beautyStyle];
      let partySize = 1; // Default to bride only
      
      if (preferences.beautyStyle === 'Bride and Party' && preferences.bridesmaidCount) {
        partySize = parseInt(preferences.bridesmaidCount) + 1; // Add 1 for the bride
      }
      
      const partySizeFactor = Math.max(0.2, Math.min(0.5, (partySize - 1) * 0.1)); // 10% per additional person, min 20%, max 50%
      const finalMultiplier = Math.min(baseMultiplier * (1 + partySizeFactor), 2.0);
      
      if (preferences.beautyStyle === 'Bride and Party') {
        adjustments.push(`Adjusted beauty services budget for ${partySize} people`);
      }
      
      return finalMultiplier;
    })(),
  }

  // Apply the calculated multipliers to each category
  Object.entries(serviceMultipliersEffect).forEach(([category, multiplier]) => {
    if (category in categoryMultipliers) {
      categoryMultipliers[category as CategoryType] = multiplier
    }
  })

  // First pass: Calculate initial multipliers for each category using weighted combinations
  const MAX_CATEGORY_MULTIPLIER = 2.0 // More conservative cap
  
  Object.keys(baseCosts).forEach((category) => {
    const cat = category as CategoryType
    
    // Skip attire category as it uses exact sum
    if (cat === 'attire') {
      categoryMultipliers[cat] = serviceMultipliersEffect.attire;
      return;
    }

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
    const attireCost = baseCosts.attire.typical * categoryMultipliers.attire;
    const nonAttireCost = initialTotalCost - attireCost;
    
    // Scale only non-attire categories to fit remaining budget
    const remainingBudget = totalBudget - attireCost;
    const scalingFactor = remainingBudget / nonAttireCost;
    
    adjustments.push(`Adjusted non-attire costs down by ${Math.round((1 - scalingFactor) * 100)}% to meet target budget of ${formatCurrency(totalBudget)}`);
    
    Object.keys(categoryMultipliers).forEach((category) => {
      if (category !== 'attire') {
        categoryMultipliers[category as CategoryType] *= scalingFactor;
      }
    });
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

// Mock ZIP code data - in production this would come from an API
const zipCodeData: Record<string, { city: string; state: string; costFactor: number }> = {
  // San Francisco area
  '94102': { city: 'San Francisco', state: 'CA', costFactor: 2.1 },
  '94103': { city: 'San Francisco', state: 'CA', costFactor: 2.0 },
  '94110': { city: 'San Francisco', state: 'CA', costFactor: 1.9 },
  // New York area
  '10001': { city: 'New York', state: 'NY', costFactor: 2.1 },
  '10002': { city: 'New York', state: 'NY', costFactor: 2.0 },
  '11201': { city: 'Brooklyn', state: 'NY', costFactor: 1.8 },
  // Los Angeles area
  '90001': { city: 'Los Angeles', state: 'CA', costFactor: 1.8 },
  '90210': { city: 'Beverly Hills', state: 'CA', costFactor: 2.1 },
  '90401': { city: 'Santa Monica', state: 'CA', costFactor: 1.9 }
};

// Function to get cost factor from ZIP code with city fallback
const getLocationCostFactor = (location: LocationData): number => {
  // If ZIP code is provided and valid, use it
  if (location.zipCode && zipCodeData[location.zipCode]) {
    return zipCodeData[location.zipCode].costFactor;
  }

  // Fallback to city-based lookup
  const normalizedCity = normalizeCity(location.city);
  const locationKey = location.state 
    ? `${normalizedCity}, ${location.state}`
    : normalizedCity;
  
  // Try exact match first, then partial matches
  let locationFactor = locationCostFactors[locationKey];
  if (!locationFactor) {
    const cityMatch = Object.keys(locationCostFactors).find(key => 
      key.toLowerCase().includes(normalizedCity.toLowerCase())
    );
    locationFactor = cityMatch 
      ? locationCostFactors[cityMatch]
      : locationCostFactors['Default US'];
  }

  return locationFactor;
};

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
      transportationType?: string
      stationeryType?: string
      beautyStyle?: string
      bridesmaidCount?: string
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

      // Use the new location cost factor function
      const locationFactor = getLocationCostFactor(location);

      // Calculate seasonal factor based on wedding date if available
      const seasonalFactor = location.weddingDate 
        ? calculateSeasonalFactor(new Date(location.weddingDate))
        : 1.0;

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
          rationale: categoryInfo.description,
          notes: categoryInfo.costBreakdown,
          description: categoryInfo.scalingExplanation,
          budgetingTips: []
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

// Add type guards for new types
const isTransportationType = (value: string): value is TransportationType =>
  ['None', 'Venue to Venue', 'Hotel to Venue', 'Both'].includes(value)

const isStationeryType = (value: string): value is StationeryType =>
  ['Digital', 'Print', 'Both'].includes(value)

const isBeautyStyle = (value: string): value is BeautyStyle =>
  ['DIY', 'Bride Only', 'Bride and Party'].includes(value)

export default budgetStorage

