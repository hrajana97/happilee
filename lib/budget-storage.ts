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
type CategoryType = 'venue' | 'catering' | 'photography' | 'attire' | 'floral' | 'music' | 'stationery' | 'favors' | 'transportation' | 'beauty'

interface CostRange {
  typical: number;
  minimum: number;
  maximum: number;
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
  perPersonCost?: number  // Optional field for catering category
}

// Use BudgetCategoryDetail as our BudgetCategory type
type BudgetCategory = BudgetCategoryDetail

// Update the baseCosts type
const baseCosts: Record<CategoryType, CostRange> = {
  venue: {
    typical: 15000,  // Increased for NYC market
    minimum: 8000,
    maximum: 30000
  },
  catering: {
    typical: 85,    // Base per person cost from 2023 data
    minimum: 65,    // Minimum per person
    maximum: 150    // Maximum per person for premium service
  },
  photography: {
    typical: 5000,
    minimum: 3500,
    maximum: 10000
  },
  attire: {
    typical: 3000,
    minimum: 1500,
    maximum: 8000
  },
  floral: {
    typical: 5000,
    minimum: 3000,
    maximum: 10000
  },
  music: {
    typical: 3500,
    minimum: 2000,
    maximum: 8000
  },
  stationery: {
    typical: 1500,
    minimum: 800,
    maximum: 4000
  },
  favors: {
    typical: 1500,
    minimum: 800,
    maximum: 3500
  },
  transportation: {
    typical: 2000,
    minimum: 1000,
    maximum: 5000
  },
  beauty: {
    typical: 1000,
    minimum: 600,
    maximum: 3000
  }
}

// Export types
export type CateringStyle = 'Plated Service (+30% over buffet)' | 'Buffet Service (Base Rate)' | 'Family Style (+20% over buffet)' | 'Food Stations (+15% over buffet)';
export type BarService = 'Open Bar' | 'Beer & Wine Only' | 'Cash Bar' | 'No Alcohol';
export type PhotoVideo = 'Photography Only' | 'Videography Only' | 'Both Photography & Videography'
export type Coverage = 'Full Day Coverage (8-10 hours)' | 'Partial Day Coverage (6 hours)' | 'Ceremony & Portraits Only (4 hours)';
export type FloralStyle = 'Fresh Flowers (Premium)' | 'Artificial Flowers (Budget-Friendly)' | 'Mixed Fresh & Artificial'
export type WeddingPartySize = 'Small (1-4 people)' | 'Medium (5-8 people)' | 'Large (9+ people)'
export type CeremonyDecorLevel = 'Minimal' | 'Standard' | 'Elaborate'
export type AdditionalDecorAreas = 'None' | 'Some' | 'Extensive'
export type DiyElements = 'Yes, planning DIY elements' | 'No DIY elements planned' | 'Maybe, still deciding'
export type MusicChoice = 'DJ' | 'Band' | 'Both DJ & Band' | 'No Live Music (Playlist)';
export type BeautyStyle = 'DIY' | 'Bride Only' | 'Bride and Party';
export type StationeryType = '' | 'Digital Only' | 'Printed Only' | 'Both Digital & Print';
export type SaveTheDateType = '' | 'digital' | 'printed' | 'none';
export type InvitationType = '' | 'digital' | 'printed' | 'both';
export type TransportationType = 'None' | 'Guest Shuttle Service' | 'Wedding Party Transportation' | 'Both'
export type PlannerType = 'Full Wedding Planner' | 'Month-of Coordinator' | 'Day-of Coordinator' | 'No Professional Help'
export type EntertainmentType = 'live music' | 'no live - will use recorded track' | 'none'
export type BeautyCoverage = 'Full Wedding Party' | 'Bride Only' | 'Bride & Bridesmaids' | 'None Needed'

export type ServiceMultipliers = {
  catering: Record<CateringStyle, number>
  bar: Record<BarService, number>
  photography: Record<PhotoVideo, number>
  coverage: Record<Coverage, number>
  floral: Record<FloralStyle, number>
  music: Record<MusicChoice, number>
  stationery: Record<StationeryType, number>
  favors: Record<InvitationType, number>
  transportation: Record<TransportationType, number>
  beauty: Record<BeautyStyle, number>
  saveTheDate: Record<SaveTheDateType, number>
  invitation: Record<InvitationType, number>
}

interface FloralMultipliers {
  style: Record<FloralStyle, number>
  partySize: Record<WeddingPartySize, number>
  ceremonyDecor: Record<CeremonyDecorLevel, number>
  additionalDecor: Record<AdditionalDecorAreas, number>
}

const floralMultipliers: FloralMultipliers = {
  style: {
    'Fresh Flowers (Premium)': 1.5,
    'Artificial Flowers (Budget-Friendly)': 0.6,
    'Mixed Fresh & Artificial': 1.0
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

// Define the multipliers for each service type
export const serviceMultipliers: ServiceMultipliers = {
  catering: {
    'Plated Service (+30% over buffet)': 1.3,
    'Buffet Service (Base Rate)': 1.0,
    'Family Style (+20% over buffet)': 1.2,
    'Food Stations (+15% over buffet)': 1.15
  },
  bar: {
    'Open Bar': 1.3,           // Reduced from 1.5x
    'Beer & Wine Only': 1.15,  // Reduced from 1.3x
    'Cash Bar': 1.0,
    'No Alcohol': 0.8
  },
  photography: {
    'Both Photography & Videography': 1.5,
    'Photography Only': 1.0,
    'Videography Only': 0.8
  },
  coverage: {
    'Full Day Coverage (8-10 hours)': 1.5,
    'Partial Day Coverage (6 hours)': 1.0,
    'Ceremony & Portraits Only (4 hours)': 0.7
  },
  floral: {
    'Fresh Flowers (Premium)': 1.5,
    'Artificial Flowers (Budget-Friendly)': 0.5,
    'Mixed Fresh & Artificial': 1.0
  },
  music: {
    'DJ': 1.0,
    'Band': 2.0,
    'Both DJ & Band': 2.5,
    'No Live Music (Playlist)': 0.3
  },
  beauty: {
    'DIY': 0.3,
    'Bride Only': 1.0,
    'Bride and Party': 1.8  // Increased to better reflect per-person costs
  },
  transportation: {
    'None': 0,
    'Guest Shuttle Service': 1.2,
    'Wedding Party Transportation': 0.8,
    'Both': 1.5
  },
  stationery: {
    '': 1.0,
    'Digital Only': 0.7,
    'Printed Only': 1.2,
    'Both Digital & Print': 1.5
  },
  favors: {
    '': 1.0,
    'digital': 0.3,
    'printed': 0.8,
    'both': 1.0
  },
  saveTheDate: {
    '': 1.0,
    'digital': 0.3,
    'printed': 0.8,
    'none': 0
  },
  invitation: {
    '': 1.0,
    'digital': 0.3,
    'printed': 0.8,
    'both': 1.0
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
  floral: { fixed: 0.3, variable: 0.6, staffing: 0.1 },
  music: { fixed: 0.8, variable: 0, staffing: 0.2 },
  stationery: { fixed: 0.2, variable: 0.8, staffing: 0 },
  favors: { fixed: 0.1, variable: 0.9, staffing: 0 },
  transportation: { fixed: 0.6, variable: 0.3, staffing: 0.1 },
  beauty: { fixed: 0.3, variable: 0.6, staffing: 0.1 }  // Adjusted to better reflect per-person costs
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
  const baseTotal = Object.values(baseCosts).reduce((sum, cost) => sum + cost.minimum, 0)
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
export const isCateringStyle = (value: string): value is CateringStyle => 
  Object.keys(serviceMultipliers.catering).includes(value)

export const isBarService = (value: string): value is BarService =>
  Object.keys(serviceMultipliers.bar).includes(value)

export const isPhotoVideo = (value: string): value is PhotoVideo =>
  Object.keys(serviceMultipliers.photography).includes(value)

export const isCoverage = (value: string): value is Coverage =>
  ['Ceremony Only', 'Reception Only', 'Full Day Coverage', 'Two Day Coverage', 'Elopement Package'].includes(value)

export const isFloralStyle = (value: string): value is FloralStyle =>
  ['Fresh Flowers (Premium)', 'Artificial Flowers (Budget-Friendly)', 'Mixed Fresh & Artificial'].includes(value)

export const isDiyElements = (value: string): value is DiyElements =>
  ['Yes, planning DIY elements', 'No DIY elements planned', 'Maybe, still deciding'].includes(value)

export const isMusicChoice = (value: string): value is MusicChoice =>
  Object.keys(serviceMultipliers.music).includes(value)

export const isBeautyStyle = (value: string): value is BeautyStyle =>
  ['Bride Only', 'Bride and Party'].includes(value)

export const isTransportationType = (value: string): value is TransportationType =>
  ['None', 'Guest Shuttle Service', 'Wedding Party Transportation', 'Both'].includes(value)

export const isStationeryType = (value: string): value is StationeryType =>
  ['', 'Digital Only', 'Printed Only', 'Both Digital & Print'].includes(value)

export const isSaveTheDateType = (value: string): value is SaveTheDateType =>
  ['', 'digital', 'printed', 'none'].includes(value)

export const isInvitationType = (value: string): value is InvitationType =>
  ['', 'digital', 'printed', 'both'].includes(value)

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
  floral: {
    description: "Floral arrangements based on your chosen style, wedding party size, and decor preferences.",
    costBreakdown: "30% personal flowers (based on party size), 40% ceremony decor (by chosen level), 30% reception decor (by area count)",
    scalingExplanation: "Costs vary by floral style (fresh/artificial/mixed), wedding party size, ceremony decor level, and number of additional decor areas."
  },
  music: {
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
  beauty: {
    description: "Professional hair and makeup services for the bride and optional wedding party coverage. Includes trial sessions, day-of services, and touch-up kits.",
    costBreakdown: "Base cost varies by service level:\n- DIY: $200-300 (includes consultation and products)\n- Bride Only: $300-500 (includes trial and day-of services)\n- Bride and Party: $800-1,500 (varies by party size)\n\nTypical costs per service:\n- Bridal Makeup: $140-200\n- Bridal Hair: $150-200\n- Bridesmaid Hair & Makeup: $185 total ($95 hair, $90 makeup)",
    scalingExplanation: "Final cost is determined by:\n1. Service choice (DIY/Bride Only/Bride and Party)\n2. Number of people needing services\n3. Location factor (higher in major cities)\n4. Additional services (trials: $75-150, airbrush makeup: +$50-75, elaborate styles: +$50-100)"
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
  ceremonyMusic?: 'Live Music' | 'No Live - Will Use Recorded Track' | 'None'
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
  transportationGuestCount?: string
  transportationHours?: string
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
    floral: 1.0,
    music: 1.0,
    stationery: 1.0,
    favors: 1.0,
    transportation: 1.0,
    beauty: 1.0
  }
  
  // Calculate base multipliers with caps
  const baseLocationFactor = Math.min(locationFactor, 2.5) // Increased cap for high-cost areas
  const baseSeasonalFactor = seasonalFactor // Already capped between 1.0-1.2
  const baseGuestFactor = Math.pow(guestCount / 100, 0.85) // Adjusted guest count scaling
  const baseStaffingFactor = calculateStaffingFactor(guestCount)

  // Calculate service style multipliers
  const serviceMultipliersEffect: Record<CategoryType, number> = {
    venue: 1.0,
    catering: preferences.cateringStyle && isCateringStyle(preferences.cateringStyle) 
      ? serviceMultipliers.catering[preferences.cateringStyle]
      : 1.0,
    photography: preferences.photoVideo && isPhotoVideo(preferences.photoVideo)
      ? serviceMultipliers.photography[preferences.photoVideo]
      : 1.0,
    attire: 1.0,
    floral: preferences.floralStyle && isFloralStyle(preferences.floralStyle)
      ? serviceMultipliers.floral[preferences.floralStyle]
      : 1.0,
    music: preferences.musicChoice && isMusicChoice(preferences.musicChoice)
      ? serviceMultipliers.music[preferences.musicChoice]
      : 1.0,
    beauty: preferences.beautyStyle && isBeautyStyle(preferences.beautyStyle)
      ? serviceMultipliers.beauty[preferences.beautyStyle]
      : 1.0,
    transportation: preferences.transportationType && isTransportationType(preferences.transportationType)
      ? serviceMultipliers.transportation[preferences.transportationType]
      : 1.0,
    stationery: preferences.stationeryType && isStationeryType(preferences.stationeryType)
      ? serviceMultipliers.stationery[preferences.stationeryType]
      : 1.0,
    favors: preferences.includeFavors
      ? (preferences.favorCostPerPerson ? parseFloat(preferences.favorCostPerPerson) / 5 : 1.0)
      : 0
  }

  // First pass: Calculate initial multipliers for each category
  Object.keys(baseCosts).forEach((category) => {
    const cat = category as CategoryType
    let totalMultiplier = 1.0
    
    // Apply location factor (weighted by category)
    if (['venue', 'catering'].includes(cat)) {
      totalMultiplier *= baseLocationFactor
    } else {
      // Less dilution of location factor for other categories
      totalMultiplier *= (baseLocationFactor * 0.5 + 0.5)
    }
    
    // Apply seasonal factor (mainly affects venue and catering)
    if (['venue', 'catering'].includes(cat)) {
      totalMultiplier *= baseSeasonalFactor
    }
    
    // Apply guest count scaling - FIXED to prevent double counting
    if (cat === 'catering') {
      // For catering, we'll apply service multipliers but handle guest count separately
      const cateringStyle = preferences.cateringStyle && isCateringStyle(preferences.cateringStyle)
        ? serviceMultipliers.catering[preferences.cateringStyle]
        : 1.0
      const barService = preferences.barService && isBarService(preferences.barService)
        ? serviceMultipliers.bar[preferences.barService]
        : 1.0
      totalMultiplier *= cateringStyle * barService
    } else if (['venue', 'rentals'].includes(cat)) {
      // Venue and rentals scale less than linearly
      totalMultiplier *= baseGuestFactor
    } else if (['favors', 'stationery'].includes(cat)) {
      // These scale mostly with guest count but have some fixed costs
      totalMultiplier *= (guestCount * 0.8 + 20) / 100
    }
    
    // Apply staffing factor where relevant
    if (['catering', 'service', 'coordination'].includes(cat)) {
      totalMultiplier *= baseStaffingFactor
    }
    
    // Set minimum multipliers to prevent unrealistic low costs
    const minMultipliers: Record<CategoryType, number> = {
      venue: 0.5,
      catering: 0.7, // Ensures minimum viable per-person cost
      photography: 0.6,
      attire: 0.5,
      floral: 0.4,
      music: 0.5,
      stationery: 0.3,
      favors: 0.2,
      transportation: 0.4,
      beauty: 0.4
    }
    
    totalMultiplier = Math.max(totalMultiplier, minMultipliers[cat])
    
    // Cap the multiplier to prevent unrealistic scaling
    const MAX_MULTIPLIER = cat === 'catering' ? 3.0 : 3.0 // Unified cap
    if (totalMultiplier > MAX_MULTIPLIER) {
      adjustments.push(`${cat.charAt(0).toUpperCase() + cat.slice(1)} costs were capped at ${MAX_MULTIPLIER}x to maintain realistic pricing`)
      totalMultiplier = MAX_MULTIPLIER
    }
    
    categoryMultipliers[cat] = totalMultiplier
  })

  // Calculate initial total cost
  let initialTotalCost = 0
  Object.keys(baseCosts).forEach((category) => {
    const cat = category as CategoryType
    if (cat === 'favors' && preferences.includeFavors === false) return
    
    let baseCost = baseCosts[cat].typical
    
    // For catering, calculate total cost based on per-person cost
    let categoryTotal: number
    if (cat === 'catering') {
      const basePerPersonCost = baseCost * categoryMultipliers[cat]
      categoryTotal = basePerPersonCost * guestCount
      initialTotalCost += categoryTotal
      
      // Store the per-person cost in the multiplier for later reference
      categoryMultipliers[cat] = basePerPersonCost / baseCost
    } else {
      categoryTotal = baseCost * categoryMultipliers[cat]
      initialTotalCost += categoryTotal
    }
    
    // Add minimum cost check
    const minCosts: Record<CategoryType, number> = {
      venue: 5000,
      catering: guestCount * 65, // Minimum $65 per person
      photography: 2500,
      attire: 1000,
      floral: 2000,
      music: 1500,
      stationery: 500,
      favors: preferences.includeFavors ? 200 : 0,
      transportation: 800,
      beauty: 500
    }
    
    if (categoryTotal < minCosts[cat]) {
      const adjustment = minCosts[cat] - categoryTotal
      initialTotalCost += adjustment
      if (cat === 'catering') {
        // For catering, adjust the per-person multiplier
        categoryMultipliers[cat] = (minCosts[cat] / guestCount) / baseCost
      } else {
        categoryMultipliers[cat] *= (minCosts[cat] / categoryTotal)
      }
      adjustments.push(`${cat.charAt(0).toUpperCase() + cat.slice(1)} costs were adjusted up to meet minimum viable cost of ${formatCurrency(minCosts[cat])}`)
    }
  })

  // Scale to fit within total budget if needed
  if (initialTotalCost > totalBudget) {
    const scalingFactor = totalBudget / initialTotalCost
    adjustments.push(`Adjusted costs down by ${Math.round((1 - scalingFactor) * 100)}% to meet target budget of ${formatCurrency(totalBudget)}`)
    
    Object.keys(categoryMultipliers).forEach((category) => {
      if (category !== 'attire') {
        categoryMultipliers[category as CategoryType] *= scalingFactor
      }
    })
  }

  // Calculate final ranges
  const calculateRange = (costType: 'minimum' | 'typical' | 'maximum'): number => {
    return Object.keys(baseCosts).reduce((sum, category) => {
      const cat = category as CategoryType
      if (cat === 'favors' && preferences.includeFavors === false) return sum
      
      let baseCost = baseCosts[cat][costType]
      // For catering, use per-person cost
      if (cat === 'catering') {
        baseCost *= guestCount
      }
      
      return sum + (baseCost * categoryMultipliers[cat])
    }, 0)
  }

  return {
    min: calculateRange('minimum'),
    typical: calculateRange('typical'),
    max: calculateRange('maximum'),
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

// Add function to get location explanation
const getLocationExplanation = (location: LocationData, locationFactor: number): string => {
  const normalizedCity = normalizeCity(location.city);
  const locationKey = location.state 
    ? `${normalizedCity}, ${location.state}`
    : normalizedCity;

  if (locationFactor === 1.0) {
    return `Your location (${locationKey}) has average wedding costs compared to the national average. This means your budget will go further here than in major metropolitan areas.`;
  } else if (locationFactor > 1.0) {
    return `Your location (${locationKey}) has higher than average wedding costs (${locationFactor}x the national average). This is typical for major metropolitan areas and popular wedding destinations.`;
  } else {
    return `Your location (${locationKey}) has lower than average wedding costs (${locationFactor}x the national average). This means your budget will go further here than in major cities.`;
  }
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
    preferences?: BudgetPreferences
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

      // Get location factor dynamically
      const locationFactor = getLocationCostFactor(location)
      const locationExplanation = getLocationExplanation(location, locationFactor)

      // Calculate seasonal factor
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

      const suggestedBudget = budgetRanges.typical

      // Create categories
      const categories: BudgetCategory[] = Object.entries(baseCosts)
        .filter(([name]) => {
          if (name === 'favors' && preferences?.includeFavors === false) {
            return false
          }
          return true
        })
        .map(([name, ranges]) => {
          const categoryInfo = categoryDescriptions[name as CategoryType]
          const priority: Priority = priorities.includes(name) ? 'high' : 'medium'
          
          // Handle attire category separately using direct user inputs
          if (name === 'attire' && preferences) {
            const dressBudget = preferences.dressBudget ? parseFloat(preferences.dressBudget) : 0
            const suitBudget = preferences.suitBudget ? parseFloat(preferences.suitBudget) : 0
            const accessoriesBudget = preferences.accessoriesBudget ? parseFloat(preferences.accessoriesBudget) : 0
            const receptionDressBudget = preferences.needReceptionDress && preferences.receptionDressBudget 
              ? parseFloat(preferences.receptionDressBudget) 
              : 0

            const totalAttireCost = dressBudget + suitBudget + accessoriesBudget + receptionDressBudget

            return {
              id: name.toLowerCase(),
              name: name.charAt(0).toUpperCase() + name.slice(1),
              percentage: Math.round((totalAttireCost / suggestedBudget) * 100),
              estimatedCost: totalAttireCost,
              actualCost: 0,
              remaining: totalAttireCost,
              rationale: `Based on specified budgets: Dress ($${dressBudget}), Suit ($${suitBudget}), Accessories ($${accessoriesBudget})${preferences.needReceptionDress ? `, Reception Dress ($${receptionDressBudget})` : ''}`,
              notes: categoryInfo.costBreakdown,
              description: categoryInfo.scalingExplanation,
              budgetingTips: [],
              priority,
              perPersonCost: totalAttireCost / guestCount
            }
          }

          // Calculate other categories normally
          const totalTypical = Object.entries(baseCosts).reduce((sum, [catName, r]) => {
            if (catName === 'favors' && preferences?.includeFavors === false) {
              return sum
            }
            if (catName === 'attire') {
              return sum
            }
            if (catName === 'catering') {
              // For total calculation, just use the base per-person cost × guest count
              return sum + (r.typical * guestCount)
            }
            return sum + r.typical
          }, 0)
          
          // Calculate total budget first
          const totalBudget = suggestedBudget;

          let estimatedCost;
          let percentage;
          if (name === 'catering') {
            // Calculate catering cost with proper multipliers
            const basePerPersonCost = ranges.typical;
            const cateringStyle = preferences?.cateringStyle && isCateringStyle(preferences.cateringStyle)
              ? serviceMultipliers.catering[preferences.cateringStyle]
              : 1.0;
            const barService = preferences?.barService && isBarService(preferences.barService)
              ? serviceMultipliers.bar[preferences.barService]
              : 1.0;
            
            // Apply multipliers to base cost in a controlled way
            const adjustedPerPersonCost = basePerPersonCost * Math.min(cateringStyle * barService, 2.0); // Cap combined service multipliers
            const locationAdjustedCost = adjustedPerPersonCost * Math.min(locationFactor, 1.5); // Cap location impact
            estimatedCost = Math.round(locationAdjustedCost * guestCount);
            percentage = (estimatedCost / totalBudget) * 100;

            // Add per-person cost to the rationale
            const rationale = `Total catering cost for ${guestCount} guests at ${formatCurrency(locationAdjustedCost)} per person. ` +
              `Includes ${preferences?.cateringStyle || 'standard'} service style and ${preferences?.barService || 'standard bar'} service.`;

            return {
              id: name.toLowerCase(),
              name: name.charAt(0).toUpperCase() + name.slice(1),
              percentage: Math.round(percentage),
              estimatedCost,
              actualCost: 0,
              remaining: estimatedCost,
              rationale,
              notes: categoryInfo.costBreakdown,
              description: categoryInfo.scalingExplanation,
              budgetingTips: [],
              priority,
              perPersonCost: estimatedCost / guestCount
            }
          } else if (name === 'transportation' && preferences?.transportationType === 'None') {
            estimatedCost = 0;
            percentage = 0;
          } else {
            percentage = (ranges.typical / totalTypical) * 100;
            estimatedCost = Math.round(suggestedBudget * (percentage / 100));
          }
          
          return {
            id: name.toLowerCase(),
            name: name.charAt(0).toUpperCase() + name.slice(1),
            percentage: Math.round(percentage),
            estimatedCost,
            actualCost: 0,
            remaining: estimatedCost,
            rationale: categoryInfo.description,
            notes: categoryInfo.costBreakdown,
            description: categoryInfo.scalingExplanation,
            budgetingTips: [],
            priority,
            perPersonCost: estimatedCost / guestCount
          }
        })

      return {
        categories,
        rationale: {
          totalBudget: `Suggested budget range: ${formatCurrency(budgetRanges.min)} - ${formatCurrency(budgetRanges.max)}`,
          locationFactor,
          locationExplanation,
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

