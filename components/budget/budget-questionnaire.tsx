"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BudgetData, BudgetPreferences } from "@/types/budget"
import { storage } from "@/lib/storage"
import budgetStorage from "@/lib/budget-storage"
import { ArrowLeft, Pencil, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useSearchParams } from 'next/navigation';
import { Switch } from "@/components/ui/switch"
import { BudgetAssistant } from "@/components/budget/budget-assistant"
import { motion } from "framer-motion"

// Add formatCurrency helper function
const formatCurrency = (amount: string | number) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount;
  return isNaN(numericAmount) ? '0' : numericAmount.toLocaleString('en-US');
};

interface BudgetFormData {
  totalBudget: string;
  guestCount: string;
  weddingDate: string;
  isDestination: boolean;
  city: string;
  state: string;
  country: string;
  
  // Venue
  separateVenues: boolean;
  ceremonyVenueType: typeof VENUE_TYPE_OPTIONS[number];
  
  // Catering
  cateringStyle: typeof CATERING_OPTIONS[number];
  barType: typeof BAR_OPTIONS[number];
  
  // Hair and Makeup
  beautyStyle: typeof BEAUTY_STYLE_OPTIONS[number];
  bridesmaidCount: string;
  makeupFor: string[];
  makeupServices: string[];
  
  // Transportation
  needTransportation: boolean;
  transportationType: typeof TRANSPORTATION_TYPE_OPTIONS[number];
  transportationGuestCount: string;
  transportationHours: string;
  
  // Favors
  includeFavors: boolean;
  favorCostPerPerson: string;
  
  // Stationery
  stationeryType: typeof STATIONERY_TYPE_OPTIONS[number];
  saveTheDate: 'digital' | 'printed' | 'none';
  invitationType: 'digital' | 'printed' | 'both';
  
  // Florals
  floralStyle: typeof FLORAL_STYLE_OPTIONS[number];
  bouquetCount: string;
  needCeremonyFlowers: boolean;
  centerpeiceCount: string;
  needExtraDecor: boolean;
  weddingPartySize: typeof WEDDING_PARTY_SIZES[number];
  ceremonyDecorLevel: typeof CEREMONY_DECOR_LEVELS[number];
  additionalDecorAreas: typeof ADDITIONAL_DECOR_AREAS[number];
  
  // Attire
  dressType: typeof DRESS_TYPE_OPTIONS[number];
  dressBudget: string;
  suitBudget: string;
  accessoriesBudget: string;
  needAlterations: boolean;
  needReceptionDress: boolean;
  receptionDressBudget: string;
  suitCount: string;
  
  // Photography
  photoVideo: typeof PHOTO_VIDEO_OPTIONS[number];
  coverage: typeof COVERAGE_OPTIONS[number];
  coverageHours: string;
  
  // Entertainment
  ceremonyMusic: typeof CEREMONY_MUSIC_OPTIONS[number];
  receptionMusic: typeof RECEPTION_MUSIC_OPTIONS[number];
  musicHours: string;
}

// Update the predefined options
const CATERING_OPTIONS = [
  "Plated Service (+30% over buffet)",
  "Buffet Service (Base Rate)",
  "Family Style (+20% over buffet)",
  "Food Stations (+15% over buffet)"
] as const;

const BAR_OPTIONS = [
  "Open Bar",
  "Beer & Wine Only",
  "Cash Bar",
  "No Alcohol"
] as const;

const PHOTO_VIDEO_OPTIONS = ["Both Photography & Videography", "Photography Only", "Videography Only"] as const;
const COVERAGE_OPTIONS = ["Full Day Coverage (8-10 hours)", "Partial Day Coverage (6 hours)", "Ceremony & Portraits Only (4 hours)"] as const;
const FLORAL_STYLE_OPTIONS = ["Fresh Flowers (Premium)", "Artificial Flowers (Budget-Friendly)", "Mixed Fresh & Artificial"] as const;
const CEREMONY_MUSIC_OPTIONS = ["Live Music", "No Live - Will Use Recorded Track", "None"] as const;
const RECEPTION_MUSIC_OPTIONS = ["DJ", "Band", "Both DJ & Band", "No Live Music (Playlist)"] as const;
const BEAUTY_STYLE_OPTIONS = ["DIY", "Bride Only", "Bride and Party"] as const;
const VENUE_TYPE_OPTIONS = ["paid", "church", "temple", "family-property", "other"] as const;
const TRANSPORTATION_TYPE_OPTIONS = [
  "None",
  "Guest Shuttle Service",
  "Wedding Party Transportation",
  "Both"
] as const;
const STATIONERY_TYPE_OPTIONS = ["Digital Only", "Printed Only", "Both Digital & Print"] as const;
const DRESS_TYPE_OPTIONS = ["Custom", "Off Rack"] as const;
const WEDDING_PARTY_SIZES = ["None (Couple Only)", "Small (1-4 people)", "Medium (5-8 people)", "Large (9+ people)"] as const;
const CEREMONY_DECOR_LEVELS = ["Minimal", "Standard", "Elaborate"] as const;
const ADDITIONAL_DECOR_AREAS = ["None", "Some", "Extensive"] as const;

type StepKey = 'venue' | 'catering' | 'photo-video' | 'decor' | 'entertainment' | 
               'transportation' | 'attire' | 'beauty' | 'stationery' | 'favors' | 
               'planning' | 'final';

const STEP_MAP: Record<StepKey, number> = {
  'venue': 1,
  'catering': 4,
  'photo-video': 2,
  'decor': 3,
  'entertainment': 7,
  'transportation': 6,
  'attire': 10,
  'beauty': 5,
  'stationery': 8,
  'favors': 9,
  'planning': 11,
  'final': 11
};

// Helper function to map transportation types
const mapTransportationType = (type: typeof TRANSPORTATION_TYPE_OPTIONS[number]): BudgetPreferences['transportationType'] => {
  return type;
};

export default function BudgetSurvey() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [budgetData, setBudgetData] = useState<BudgetFormData>({
    totalBudget: '',
    guestCount: '',
    weddingDate: '',
    isDestination: false,
    city: '',
    state: '',
    country: '',
    separateVenues: false,
    ceremonyVenueType: '' as typeof VENUE_TYPE_OPTIONS[number],
    cateringStyle: '' as typeof CATERING_OPTIONS[number],
    barType: '' as typeof BAR_OPTIONS[number],
    beautyStyle: '' as typeof BEAUTY_STYLE_OPTIONS[number],
    bridesmaidCount: '',
    makeupFor: [],
    makeupServices: [],
    needTransportation: false,
    transportationType: '' as typeof TRANSPORTATION_TYPE_OPTIONS[number],
    transportationGuestCount: '',
    transportationHours: '',
    includeFavors: false,
    favorCostPerPerson: '',
    stationeryType: '' as typeof STATIONERY_TYPE_OPTIONS[number],
    floralStyle: '' as typeof FLORAL_STYLE_OPTIONS[number],
    bouquetCount: '',
    needCeremonyFlowers: false,
    centerpeiceCount: '',
    needExtraDecor: false,
    dressType: '' as typeof DRESS_TYPE_OPTIONS[number],
    dressBudget: '',
    suitBudget: '',
    accessoriesBudget: '',
    needAlterations: false,
    needReceptionDress: false,
    receptionDressBudget: '',
    suitCount: '',
    photoVideo: '' as typeof PHOTO_VIDEO_OPTIONS[number],
    coverage: '' as typeof COVERAGE_OPTIONS[number],
    coverageHours: '',
    ceremonyMusic: '' as typeof CEREMONY_MUSIC_OPTIONS[number],
    receptionMusic: '' as typeof RECEPTION_MUSIC_OPTIONS[number],
    musicHours: '',
    weddingPartySize: '' as typeof WEDDING_PARTY_SIZES[number],
    ceremonyDecorLevel: '' as typeof CEREMONY_DECOR_LEVELS[number],
    additionalDecorAreas: '' as typeof ADDITIONAL_DECOR_AREAS[number],
    saveTheDate: '' as 'digital' | 'printed' | 'none',
    invitationType: '' as 'digital' | 'printed' | 'both',
  });

  useEffect(() => {
    const userData = storage.getUserData();
    const prefill = searchParams.get('prefill') === 'true';
    const fromBudget = searchParams.get('fromBudget') === 'true';
    const fromSummary = searchParams.get('fromSummary') === 'true';
    const finalStep = searchParams.get('step') === 'final';
    const stepParam = searchParams.get('step') as StepKey | null;

    // Helper function to cast preferences to correct types
    const castPreferences = (prefs: any): Partial<BudgetFormData> => {
      const result: Partial<BudgetFormData> = {};
      
      // Only copy over fields that exist in BudgetFormData
      Object.keys(prefs).forEach(key => {
        if (key in budgetData) {
          result[key as keyof BudgetFormData] = prefs[key];
        }
      });
      
      return result;
    };

    // Always prefill basic details from userData if available
    if (userData) {
      setBudgetData(prevData => ({
        ...prevData,
        totalBudget: userData.budget ? formatCurrency(userData.budget) : '',
        guestCount: userData.guestCount ? userData.guestCount.toString() : '',
        weddingDate: userData.weddingDate ? userData.weddingDate.split('T')[0] : '',
      }));
    }

    // If coming from budget breakdown or summary, also prefill preferences
    if ((fromBudget || fromSummary) && userData?.preferences) {
      setBudgetData(prevData => ({
        ...prevData,
        ...castPreferences(userData.preferences),
      }));
    }

    if (finalStep) {
      setStep(7);
    } else if (stepParam && stepParam in STEP_MAP) {
      setStep(STEP_MAP[stepParam]);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBudgetData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setBudgetData(prev => ({ ...prev, isDestination: checked }));
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const calculateBudget = () => {
    try {
      const totalBudget = parseFloat(budgetData.totalBudget.replace(/[^0-9.]/g, ''));
      const guestCount = parseInt(budgetData.guestCount) || 0;
      
      if (isNaN(totalBudget)) {
        alert('Please enter a valid total budget');
        return;
      }

      // Create priorities array based on user selections
      const priorities = [];
      
      if (budgetData.photoVideo === "Both Photography & Videography") {
        priorities.push("photography");
      }
      if (budgetData.floralStyle === "Fresh Flowers (Premium)") {
        priorities.push("florals");
      }
      if (budgetData.receptionMusic === "Band" || budgetData.receptionMusic === "Both DJ & Band") {
        priorities.push("entertainment");
      }

      // Create comprehensive preferences object with proper type casting
      const preferences: BudgetPreferences = {
        cateringStyle: budgetData.cateringStyle || undefined,
        barService: budgetData.barType || undefined,
        photoVideo: budgetData.photoVideo || undefined,
        coverage: budgetData.coverage || undefined,
        floralStyle: budgetData.floralStyle || undefined,
        musicChoice: budgetData.receptionMusic || undefined,
        beautyStyle: budgetData.beautyStyle || undefined,
        transportationType: mapTransportationType(budgetData.transportationType),
        transportationGuestCount: String(budgetData.transportationGuestCount || '0'),
        transportationHours: budgetData.transportationHours || '0',
        makeupFor: budgetData.makeupFor || [],
        makeupServices: budgetData.makeupServices || [],
        weddingPartySize: budgetData.weddingPartySize || undefined,
        ceremonyDecorLevel: budgetData.ceremonyDecorLevel || undefined,
        additionalDecorAreas: budgetData.additionalDecorAreas || undefined,
        stationeryType: budgetData.stationeryType || undefined,
        saveTheDate: budgetData.saveTheDate || undefined,
        invitationType: budgetData.invitationType || undefined,
        bridesmaidCount: budgetData.bridesmaidCount || '0',
        includeFavors: budgetData.includeFavors || false,
        favorCostPerPerson: budgetData.favorCostPerPerson || '0',
        dressBudget: budgetData.dressBudget || '0',
        suitBudget: budgetData.suitBudget || '0',
        accessoriesBudget: budgetData.accessoriesBudget || '0',
        needAlterations: budgetData.needAlterations || false,
        needReceptionDress: budgetData.needReceptionDress || false,
        receptionDressBudget: budgetData.receptionDressBudget || '0',
        suitCount: budgetData.suitCount || '0'
      };

      // Log preferences for debugging
      console.log('Calculating budget with preferences:', preferences);

      // Calculate the budget with preferences
      const result = budgetStorage.calculateBudget(
        guestCount,
        {
          city: budgetData.city,
          state: budgetData.state,
          country: budgetData.isDestination ? budgetData.country : "United States",
          isDestination: budgetData.isDestination,
          weddingDate: budgetData.weddingDate
        },
        priorities,
        preferences
      );

      console.log('Budget calculation result:', result);

      // Store the result using the correct type from types/budget
      storage.setUserData({
        name: "", // Required by UserData type
        budget: totalBudget,
        weddingDate: budgetData.weddingDate,
        guestCount: guestCount,
        calculatedBudget: {
          ...result,
          location: {
            city: budgetData.city,
            state: budgetData.state,
            country: budgetData.isDestination ? budgetData.country : "United States",
            isDestination: budgetData.isDestination,
            weddingDate: budgetData.weddingDate
          }
        },
        preferences
      });

      // Navigate to budget breakdown
      window.location.href = '/budget-breakdown';
    } catch (error) {
      console.error('Error calculating budget:', error);
      alert('There was an error calculating your budget. Please try again.');
    }
  };

  const loadDemoData = () => {
    const demoData = {
      totalBudget: '50000',
      city: 'Austin',
      state: 'TX',
      country: 'United States',
      guestCount: '100',
      weddingDate: '2024-09-15',
      photoVideo: 'Both Photography & Videography',
      coverage: 'Full Day Coverage',
      floralStyle: 'Modern & Minimalist',
      diyElements: 'No DIY elements planned',
      musicChoice: 'DJ',
      beautyCoverage: 'Full Wedding Party',
      planningAssistance: 'Month-of Coordinator',
      cateringStyle: 'Plated',
      barService: 'Full Open Bar',
      isDestination: false
    };

    // Calculate budget with demo data
    const locationData = {
      city: demoData.city,
      state: demoData.state,
      country: demoData.country
    };

    const priorities = ["photography", "entertainment"];
    const result = budgetStorage.calculateBudget(parseInt(demoData.totalBudget), locationData, priorities);

    // Store the result
    storage.setUserData({
      budget: parseInt(demoData.totalBudget),
      weddingDate: demoData.weddingDate,
      guestCount: parseInt(demoData.guestCount),
      calculatedBudget: result,
      isDemo: true
    });

    // Navigate to budget breakdown
    window.location.href = '/budget-breakdown';
  };

  // Add reset demo function
  const resetDemo = () => {
    budgetStorage.clearBudgetData();
    storage.clearUserData();
    window.location.href = '/dashboard/budget';
  };

  const handleReturnToBudget = () => {
    // Save the current preferences
    const currentUserData = storage.getUserData();
    if (currentUserData) {
      // Convert form data to BudgetPreferences format
      const preferences: BudgetPreferences = {
        cateringStyle: budgetData.cateringStyle,
        barService: budgetData.barType,
        photoVideo: budgetData.photoVideo,
        coverage: budgetData.coverage,
        floralStyle: budgetData.floralStyle,
        musicChoice: budgetData.receptionMusic,
        beautyStyle: budgetData.beautyStyle,
        transportationType: mapTransportationType(budgetData.transportationType),
        transportationGuestCount: String(parseInt(budgetData.transportationGuestCount) || 0),
        transportationHours: budgetData.transportationHours,
        makeupFor: budgetData.makeupFor,
        makeupServices: budgetData.makeupServices,
        weddingPartySize: budgetData.weddingPartySize,
        ceremonyDecorLevel: budgetData.ceremonyDecorLevel,
        additionalDecorAreas: budgetData.additionalDecorAreas,
        stationeryType: budgetData.stationeryType,
        saveTheDate: budgetData.saveTheDate,
        invitationType: budgetData.invitationType,
        bridesmaidCount: budgetData.bridesmaidCount,
        includeFavors: budgetData.includeFavors,
        favorCostPerPerson: budgetData.favorCostPerPerson,
        dressBudget: budgetData.dressBudget,
        suitBudget: budgetData.suitBudget,
        accessoriesBudget: budgetData.accessoriesBudget,
        needAlterations: budgetData.needAlterations,
        needReceptionDress: budgetData.needReceptionDress,
        receptionDressBudget: budgetData.receptionDressBudget,
        suitCount: budgetData.suitCount
      };

      storage.setUserData({
        ...currentUserData,
        preferences: {
          ...currentUserData.preferences,
          ...preferences
        }
      });
    }
    
    // Navigate back to the budget breakdown
    window.location.href = '/budget-breakdown';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sage-50/50 to-white p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-8 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#4A5D4E]">Wedding Budget Calculator</h1>
              <p className="mt-2 text-sm sm:text-base text-[#4A5D4E]">
                Let's create your personalized wedding budget based on your location and preferences
              </p>
              <p className="mt-2 text-sm sm:text-base text-[#4A5D4E]">
                This questionnaire will take less than 10 minutes to complete. If you're unsure about any answers, you can make your best estimate - all choices can be adjusted later.
              </p>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-6 p-4 rounded-lg bg-sage-100 border border-sage-200 shadow-sm relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-sage-200/50"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0, 0.5, 0] }}
            transition={{ 
              repeat: 3,
              duration: 2,
              delay: 2,
              ease: "easeInOut"
            }}
          />
          <div className="flex items-center gap-3 relative">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 0.5,
                delay: 1.5,
                repeat: 2
              }}
            >
              <MessageSquare className="h-5 w-5 text-sage-600" />
            </motion.div>
            <p className="text-sm text-sage-700">
              Have questions about typical costs or budgeting? Chat with our Budget Assistant! Click the chat icon in the bottom right.
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-4 mb-8">
          <Progress value={((step) / 12) * 100} className="flex-1 bg-sage-200 [&>[role=progressbar]]:bg-sage-700" />
          <span className="text-sm font-medium text-sage-600">{step + 1}/12</span>
        </div>

        {step === 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Verify Your Details</CardTitle>
              <p className="text-sm text-sage-600">
                We've pulled these details from your initial setup. Please verify they're correct before proceeding.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Wedding Date</Label>
                <Input
                  type="date"
                  name="weddingDate"
                  value={budgetData.weddingDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Guest Count</Label>
                <Input
                  type="number"
                  name="guestCount"
                  value={budgetData.guestCount}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Maximum Budget</Label>
                <Input
                  type="text"
                  name="totalBudget"
                  value={budgetData.totalBudget}
                  onChange={handleInputChange}
                />
              </div>

              <Button 
                onClick={() => setStep(1)} 
                className="w-full bg-[#738678] hover:bg-[#738678]/90"
              >
                Confirm & Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="destination"
                    checked={budgetData.isDestination}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="destination">This is a destination wedding</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={budgetData.city}
                  onChange={handleInputChange}
                />
              </div>

              {!budgetData.isDestination && (
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select
                    value={budgetData.state}
                    onValueChange={(value) => setBudgetData(prev => ({ ...prev, state: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      <SelectItem value="AR">Arkansas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                      <SelectItem value="CT">Connecticut</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="GA">Georgia</SelectItem>
                      <SelectItem value="HI">Hawaii</SelectItem>
                      <SelectItem value="ID">Idaho</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                      <SelectItem value="IN">Indiana</SelectItem>
                      <SelectItem value="IA">Iowa</SelectItem>
                      <SelectItem value="KS">Kansas</SelectItem>
                      <SelectItem value="KY">Kentucky</SelectItem>
                      <SelectItem value="LA">Louisiana</SelectItem>
                      <SelectItem value="ME">Maine</SelectItem>
                      <SelectItem value="MD">Maryland</SelectItem>
                      <SelectItem value="MA">Massachusetts</SelectItem>
                      <SelectItem value="MI">Michigan</SelectItem>
                      <SelectItem value="MN">Minnesota</SelectItem>
                      <SelectItem value="MS">Mississippi</SelectItem>
                      <SelectItem value="MO">Missouri</SelectItem>
                      <SelectItem value="MT">Montana</SelectItem>
                      <SelectItem value="NE">Nebraska</SelectItem>
                      <SelectItem value="NV">Nevada</SelectItem>
                      <SelectItem value="NH">New Hampshire</SelectItem>
                      <SelectItem value="NJ">New Jersey</SelectItem>
                      <SelectItem value="NM">New Mexico</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="NC">North Carolina</SelectItem>
                      <SelectItem value="ND">North Dakota</SelectItem>
                      <SelectItem value="OH">Ohio</SelectItem>
                      <SelectItem value="OK">Oklahoma</SelectItem>
                      <SelectItem value="OR">Oregon</SelectItem>
                      <SelectItem value="PA">Pennsylvania</SelectItem>
                      <SelectItem value="RI">Rhode Island</SelectItem>
                      <SelectItem value="SC">South Carolina</SelectItem>
                      <SelectItem value="SD">South Dakota</SelectItem>
                      <SelectItem value="TN">Tennessee</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="UT">Utah</SelectItem>
                      <SelectItem value="VT">Vermont</SelectItem>
                      <SelectItem value="VA">Virginia</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                      <SelectItem value="WV">West Virginia</SelectItem>
                      <SelectItem value="WI">Wisconsin</SelectItem>
                      <SelectItem value="WY">Wyoming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {budgetData.isDestination && (
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    type="text"
                    name="country"
                    placeholder="Enter country"
                    value={budgetData.country}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Photography & Videography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Photography and videography, or just one?</Label>
                <p className="text-sm text-sage-600">Full photo & video packages typically range $5000-8000, photography-only $3500-5000, and videography-only $2500-4000.</p>
                <Select
                  value={budgetData.photoVideo}
                  onValueChange={(value: typeof PHOTO_VIDEO_OPTIONS[number]) => 
                    setBudgetData(prev => ({ ...prev, photoVideo: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {PHOTO_VIDEO_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Coverage Length</Label>
                <p className="text-sm text-sage-600">Full-day coverage (8-10 hours), partial day coverage (6 hours), or ceremony & portraits only (4 hours).</p>
                <Select
                  value={budgetData.coverage}
                  onValueChange={(value: typeof COVERAGE_OPTIONS[number]) => 
                    setBudgetData(prev => ({ ...prev, coverage: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {COVERAGE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Decor & Florals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Floral Style Preference</Label>
                <p className="text-sm text-sage-600">Fresh flowers typically cost $2500-6000+, artificial flowers $500-3000, and a hybrid approach $1500-4000. Includes bridal bouquet, wedding party flowers, and reception centerpieces.</p>
                <Select
                  value={budgetData.floralStyle}
                  onValueChange={(value: typeof FLORAL_STYLE_OPTIONS[number]) => 
                    setBudgetData(prev => ({ ...prev, floralStyle: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {FLORAL_STYLE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Wedding Party Size</Label>
                <p className="text-sm text-sage-600">Each additional bouquet/boutonniere adds $150-250 for fresh flowers.</p>
                <Select
                  value={budgetData.weddingPartySize}
                  onValueChange={(value: typeof WEDDING_PARTY_SIZES[number]) => 
                    setBudgetData(prev => ({ ...prev, weddingPartySize: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEDDING_PARTY_SIZES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ceremony Decor Level</Label>
                <p className="text-sm text-sage-600">Standard decor typically includes an arch/altar arrangement ($500-800) plus aisle decorations.</p>
                <Select
                  value={budgetData.ceremonyDecorLevel}
                  onValueChange={(value: typeof CEREMONY_DECOR_LEVELS[number]) => 
                    setBudgetData(prev => ({ ...prev, ceremonyDecorLevel: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {CEREMONY_DECOR_LEVELS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Additional Decor Areas</Label>
                <p className="text-sm text-sage-600">Each additional decorated area (welcome signs, photo backdrops, lounge areas) typically adds $300-500.</p>
                <Select
                  value={budgetData.additionalDecorAreas}
                  onValueChange={(value: typeof ADDITIONAL_DECOR_AREAS[number]) => 
                    setBudgetData(prev => ({ ...prev, additionalDecorAreas: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADDITIONAL_DECOR_AREAS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Catering & Bar Service</CardTitle>
              <CardDescription className="space-y-4">
                <div>
                  Base buffet rate typically ranges $75-150 per person depending on menu selections.
                </div>

                <div>
                  <p className="font-medium mb-2">Service Styles:</p>
                  <ul className="space-y-1 list-none">
                    <li>• Plated: Full service dining with dedicated staff</li>
                    <li>• Buffet: Self-service with attendant assistance</li>
                    <li>• Family Style: Shared platters served to each table</li>
                    <li>• Food Stations: Interactive service with specialty options</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium mb-2">Bar Service Options:</p>
                  <ul className="space-y-1 list-none">
                    <li>• Open Bar ($45-60/person): House liquors, wines, and select beers</li>
                    <li>• Beer & Wine Only ($35-45/person): Domestic/imported beers and house wines</li>
                    <li>• Cash Bar: Guests pay for drinks, setup fee applies</li>
                    <li>• No Alcohol: Non-alcoholic beverages included with catering</li>
                  </ul>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Service Style</Label>
                <Select
                  value={budgetData.cateringStyle}
                  onValueChange={(value: typeof CATERING_OPTIONS[number]) => 
                    setBudgetData(prev => ({ ...prev, cateringStyle: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATERING_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bar Service</Label>
                <Select
                  value={budgetData.barType}
                  onValueChange={(value: typeof BAR_OPTIONS[number]) => 
                    setBudgetData(prev => ({ ...prev, barType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {BAR_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 5 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Hair & Makeup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Beauty Services</Label>
                <p className="text-sm text-sage-600">Bridal hair & makeup typically costs $300-500, with each additional person $150-200. Most artists require minimum bookings and may charge travel fees.</p>
                <Select
                  value={budgetData.beautyStyle}
                  onValueChange={(value: typeof BEAUTY_STYLE_OPTIONS[number]) => 
                    setBudgetData(prev => ({ ...prev, beautyStyle: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {BEAUTY_STYLE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {budgetData.beautyStyle === 'Bride and Party' && (
                <div className="space-y-2">
                  <Label>Number of Bridesmaids</Label>
                  <Input
                    type="number"
                    name="bridesmaidCount"
                    placeholder="Enter number of bridesmaids"
                    value={budgetData.bridesmaidCount}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 6 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Transportation</CardTitle>
              <CardDescription className="space-y-4">
                <div>
                  Transportation services typically require 4-hour minimums.
                </div>

                <div>
                  <p className="font-medium mb-2">Service Options:</p>
                  <ul className="space-y-1 list-none">
                    <li>• Guest Shuttle Service: $500-800 per bus (seats 30-50 guests)</li>
                    <li>• Wedding Party Transportation: $400-800 for luxury vehicles</li>
                    <li>• Combined Service: Both guest shuttle and wedding party transport</li>
                    <li>• None: No transportation service needed</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium mb-2">Additional Information:</p>
                  <ul className="space-y-1 list-none">
                    <li>• Multiple pickup/dropoff locations may increase costs</li>
                    <li>• Service duration affects final pricing</li>
                    <li>• Gratuity typically not included in base rates</li>
                  </ul>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Transportation Needs</Label>
                <Select
                  value={budgetData.transportationType}
                  onValueChange={(value: typeof TRANSPORTATION_TYPE_OPTIONS[number]) => 
                    setBudgetData(prev => ({ ...prev, transportationType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSPORTATION_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {budgetData.transportationType !== 'None' && (
                <>
                  <div className="space-y-2">
                    <Label>Number of Guests Needing Transportation</Label>
                    <p className="text-sm text-sage-600">Enter the total number of guests who will need transportation services.</p>
                    <Input
                      type="number"
                      name="transportationGuestCount"
                      placeholder="Enter number of guests"
                      value={budgetData.transportationGuestCount}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Transportation Hours Needed</Label>
                    <p className="text-sm text-sage-600">Most services require a 4-hour minimum booking.</p>
                    <Input
                      type="number"
                      name="transportationHours"
                      placeholder="Enter hours needed"
                      value={budgetData.transportationHours}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {step === 7 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Entertainment</CardTitle>
              <CardDescription className="space-y-4">
                <div>
                  Most services require a 4-6 hour minimum booking and include setup, sound equipment, and basic lighting.
                </div>

                <div>
                  <p className="font-medium mb-2">Ceremony Music:</p>
                  <ul className="space-y-1 list-none">
                    <li>• Live Music: String trio/quartet ($800-1200)</li>
                    <li>• Recorded Music: Equipment rental ($100-300)</li>
                    <li>• No Music: For intimate ceremonies</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium mb-2">Reception Entertainment:</p>
                  <ul className="space-y-1 list-none">
                    <li>• DJ: Professional DJ with MC ($1,500-2,500)</li>
                    <li>• Band: Live band performance ($4,000-8,000)</li>
                    <li>• Both DJ & Band: Full entertainment package ($6,000-10,000)</li>
                    <li>• No Live Music (Playlist): DIY playlist with sound system ($500-1,000)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium mb-2">Package Includes:</p>
                  <ul className="space-y-1 list-none">
                    <li>• Professional sound system & lighting</li>
                    <li>• Setup/breakdown & backup equipment</li>
                  </ul>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Ceremony Music</Label>
                <Select
                  value={budgetData.ceremonyMusic}
                  onValueChange={(value: typeof CEREMONY_MUSIC_OPTIONS[number]) => 
                    setBudgetData(prev => ({ ...prev, ceremonyMusic: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {CEREMONY_MUSIC_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>Reception Entertainment</Label>
                <Select
                  value={budgetData.receptionMusic}
                  onValueChange={(value: typeof RECEPTION_MUSIC_OPTIONS[number]) => 
                    setBudgetData(prev => ({ ...prev, receptionMusic: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {RECEPTION_MUSIC_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 8 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Stationery</CardTitle>
              <CardDescription>
                Choose your preferred options for save-the-dates and wedding invitations.
                Digital options are more budget-friendly, while printed options offer a traditional touch.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Stationery Type</Label>
                <Select
                  value={budgetData.stationeryType}
                  onValueChange={(value: typeof STATIONERY_TYPE_OPTIONS[number]) => 
                    setBudgetData(prev => ({ ...prev, stationeryType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stationery type" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATIONERY_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>Save the Dates</Label>
                <Select
                  value={budgetData.saveTheDate}
                  onValueChange={(value: 'digital' | 'printed' | 'none') => 
                    setBudgetData(prev => ({ ...prev, saveTheDate: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select save the date option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital">Digital ($100-300)</SelectItem>
                    <SelectItem value="printed">Printed ($300-800)</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
                
                <Label>Wedding Invitations</Label>
                <Select
                  value={budgetData.invitationType}
                  onValueChange={(value: 'digital' | 'printed' | 'both') => 
                    setBudgetData(prev => ({ ...prev, invitationType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select invitation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital">Digital Suite ($200-500)</SelectItem>
                    <SelectItem value="printed">Printed Suite ($800-2,000)</SelectItem>
                    <SelectItem value="both">Combined Digital & Print ($1,000-2,500)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 9 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Favors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Wedding Favors</Label>
                <p className="text-sm text-sage-600">Wedding favors typically cost $3-10 per guest. For {budgetData.guestCount || '100'} guests, this would be ${((parseInt(budgetData.guestCount) || 100) * 3)}-${((parseInt(budgetData.guestCount) || 100) * 10)}.</p>
                <Select
                  value={budgetData.includeFavors === true ? "yes" : budgetData.includeFavors === false ? "no" : ""}
                  onValueChange={(value) => 
                    setBudgetData(prev => ({ 
                      ...prev, 
                      includeFavors: value === "yes",
                      favorCostPerPerson: value === "no" ? "" : prev.favorCostPerPerson
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes, include favors</SelectItem>
                    <SelectItem value="no">No, skip favors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {budgetData.includeFavors && (
                <div className="space-y-2">
                  <Label>Estimated Cost per Favor</Label>
                  <Input
                    type="number"
                    name="favorCostPerPerson"
                    placeholder="Enter cost per favor"
                    value={budgetData.favorCostPerPerson}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 10 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Attire</CardTitle>
              <CardDescription>
                Attire is a very personal choice! Rather than predict what you might spend, we've broken down the main elements 
                of your wedding attire. Please enter what you think you'll spend on each item to help us allocate your budget accurately.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Wedding Dress Budget</Label>
                <p className="text-sm text-sage-600">Designer dresses typically range $2000-5000+. Alterations typically cost $300-700.</p>
                <Input
                  type="text"
                  name="dressBudget"
                  placeholder="Enter dress budget"
                  value={budgetData.dressBudget}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Would you like a separate reception dress?</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="needReceptionDress"
                    checked={budgetData.needReceptionDress}
                    onCheckedChange={(checked) => 
                      setBudgetData(prev => ({ ...prev, needReceptionDress: checked }))
                    }
                  />
                  <Label htmlFor="needReceptionDress">Yes, I want a reception dress</Label>
                </div>
              </div>

              {budgetData.needReceptionDress && (
                <div className="space-y-2">
                  <Label>Reception Dress Budget</Label>
                  <p className="text-sm text-sage-600">Reception dresses typically range from $500-2000.</p>
                  <Input
                    type="text"
                    name="receptionDressBudget"
                    placeholder="Enter reception dress budget"
                    value={budgetData.receptionDressBudget}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Suit/Tuxedo Budget</Label>
                <p className="text-sm text-sage-600">Quality suits range $500-1000, designer suits $1000-2000+.</p>
                <Input
                  type="text"
                  name="suitBudget"
                  placeholder="Enter suit/tuxedo budget"
                  value={budgetData.suitBudget}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Accessories Budget</Label>
                <p className="text-sm text-sage-600">Wedding shoes ($100-300), veil ($100-500), jewelry ($200-1000+), and undergarments ($100-300).</p>
                <Input
                  type="text"
                  name="accessoriesBudget"
                  placeholder="Enter accessories budget"
                  value={budgetData.accessoriesBudget}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 11 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-sage-600">Review your inputs before we calculate your personalized budget</p>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Location & Basic Details</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setStep(1);
                      const url = new URL(window.location.href);
                      url.searchParams.set('fromSummary', 'true');
                      window.history.pushState({}, '', url);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-sage-600" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sage-600">City</Label>
                      <p className="font-medium">{budgetData.city || "Not specified"}</p>
                    </div>
                    {budgetData.isDestination ? (
                      <div>
                        <Label className="text-sage-600">Country</Label>
                        <p className="font-medium">{budgetData.country || "Not specified"}</p>
                      </div>
                    ) : (
                      <div>
                        <Label className="text-sage-600">State</Label>
                        <p className="font-medium">{budgetData.state || "Not specified"}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sage-600">Wedding Date</Label>
                      <p className="font-medium">{budgetData.weddingDate ? new Date(budgetData.weddingDate).toLocaleDateString() : "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Guest Count</Label>
                      <p className="font-medium">{budgetData.guestCount || "0"} guests</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Total Budget</Label>
                      <p className="font-medium">${formatCurrency(budgetData.totalBudget || "0")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Photography & Videography</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setStep(2);
                      const url = new URL(window.location.href);
                      url.searchParams.set('fromSummary', 'true');
                      window.history.pushState({}, '', url);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-sage-600" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sage-600">Coverage Type</Label>
                      <p className="font-medium">{budgetData.photoVideo || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Coverage Length</Label>
                      <p className="font-medium">{budgetData.coverage || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Decor & Florals</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setStep(3);
                      const url = new URL(window.location.href);
                      url.searchParams.set('fromSummary', 'true');
                      window.history.pushState({}, '', url);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-sage-600" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sage-600">Floral Style</Label>
                      <p className="font-medium">{budgetData.floralStyle || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Wedding Party Size</Label>
                      <p className="font-medium">{budgetData.weddingPartySize || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Ceremony Decor</Label>
                      <p className="font-medium">{budgetData.ceremonyDecorLevel || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Additional Decor</Label>
                      <p className="font-medium">{budgetData.additionalDecorAreas || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Catering & Bar</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setStep(4);
                      const url = new URL(window.location.href);
                      url.searchParams.set('fromSummary', 'true');
                      window.history.pushState({}, '', url);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-sage-600" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sage-600">Catering Style</Label>
                      <p className="font-medium">{budgetData.cateringStyle || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Bar Service</Label>
                      <p className="font-medium">{budgetData.barType || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Entertainment</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setStep(7);
                      const url = new URL(window.location.href);
                      url.searchParams.set('fromSummary', 'true');
                      window.history.pushState({}, '', url);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-sage-600" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sage-600">Ceremony Music</Label>
                      <p className="font-medium">{budgetData.ceremonyMusic || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Reception Entertainment</Label>
                      <p className="font-medium">{budgetData.receptionMusic || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Entertainment Hours</Label>
                      <p className="font-medium">{budgetData.musicHours || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Beauty Services</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setStep(5);
                      const url = new URL(window.location.href);
                      url.searchParams.set('fromSummary', 'true');
                      window.history.pushState({}, '', url);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-sage-600" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sage-600">Beauty Services</Label>
                      <p className="font-medium">{budgetData.beautyStyle || "Not specified"}</p>
                    </div>
                    {budgetData.beautyStyle === 'Bride and Party' && (
                      <div>
                        <Label className="text-sage-600">Bridesmaid Count</Label>
                        <p className="font-medium">{budgetData.bridesmaidCount || "Not specified"}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Transportation</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setStep(6);
                      const url = new URL(window.location.href);
                      url.searchParams.set('fromSummary', 'true');
                      window.history.pushState({}, '', url);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-sage-600" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sage-600">Transportation Type</Label>
                      <p className="font-medium">{budgetData.transportationType || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Stationery & Favors</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setStep(7);
                      const url = new URL(window.location.href);
                      url.searchParams.set('fromSummary', 'true');
                      window.history.pushState({}, '', url);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-sage-600" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sage-600">Stationery Type</Label>
                      <p className="font-medium">{budgetData.stationeryType || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Including Favors</Label>
                      <p className="font-medium">{budgetData.includeFavors ? "Yes" : "No"}</p>
                    </div>
                    {budgetData.includeFavors && (
                      <div>
                        <Label className="text-sage-600">Cost per Favor</Label>
                        <p className="font-medium">${budgetData.favorCostPerPerson || "0"}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Attire</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setStep(10);
                      const url = new URL(window.location.href);
                      url.searchParams.set('fromSummary', 'true');
                      window.history.pushState({}, '', url);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-sage-600" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sage-600">Dress Budget</Label>
                      <p className="font-medium">${budgetData.dressBudget || "0"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Suit/Tuxedo Budget</Label>
                      <p className="font-medium">${budgetData.suitBudget || "0"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Accessories Budget</Label>
                      <p className="font-medium">${budgetData.accessoriesBudget || "0"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Reception Dress</Label>
                      <p className="font-medium">{budgetData.needReceptionDress ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 pt-8">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={step === 0}
              className="w-full sm:w-auto bg-sage-50 hover:bg-sage-100 text-[#4A5D4E] border-sage-200"
            >
              Back
            </Button>
            <Button
              variant="outline"
              onClick={loadDemoData}
              className="w-full sm:w-auto bg-sage-50 hover:bg-sage-100 text-[#4A5D4E] border-sage-200"
            >
              View Demo Budget
            </Button>
          </div>
          <div className="flex gap-2">
            {localStorage.getItem("happilai_user_type") === "demo" && (
              <Button
                variant="outline"
                onClick={resetDemo}
                className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200"
              >
                Start Over
              </Button>
            )}
            {step !== 11 && !searchParams.get('fromBudget') && !searchParams.get('fromSummary') && (
              <Button
                onClick={handleNextStep}
                className="w-full sm:w-auto bg-[#738678] hover:bg-[#4A5D4E] text-white"
              >
                Next
              </Button>
            )}
            {step === 11 && !searchParams.get('fromBudget') && !searchParams.get('fromSummary') && (
              <Button
                onClick={calculateBudget}
                className="w-full sm:w-auto bg-[#738678] hover:bg-[#4A5D4E] text-white"
              >
                Calculate Budget
              </Button>
            )}
            {(searchParams.get('fromBudget') === 'true' || searchParams.get('fromSummary') === 'true') && (
              <Button
                onClick={handleReturnToBudget}
                className="w-full sm:w-auto bg-[#738678] hover:bg-[#4A5D4E] text-white"
              >
                Confirm & Return to Budget
              </Button>
            )}
          </div>
        </div>

        <BudgetAssistant 
          budgetData={{
            budget: parseFloat(budgetData.totalBudget.replace(/[^0-9.]/g, '')) || 0,
            totalBudget: parseFloat(budgetData.totalBudget.replace(/[^0-9.]/g, '')) || 0,
            guestCount: parseInt(budgetData.guestCount) || 0,
            location: {
              city: budgetData.city,
              state: budgetData.state,
              country: budgetData.isDestination ? budgetData.country : "United States",
              isDestination: budgetData.isDestination,
              weddingDate: budgetData.weddingDate
            },
            priorities: [],
            categories: [],
            lastUpdated: new Date().toISOString(),
            rationale: {
              totalBudget: budgetData.totalBudget || "0",
              locationFactor: 1,
              seasonalFactor: 1,
              notes: []
            },
            calculatedBudget: {
              categories: [],
              rationale: {
                totalBudget: budgetData.totalBudget || "0",
                locationFactor: 1,
                seasonalFactor: 1,
                notes: []
              },
              location: {
                city: budgetData.city,
                state: budgetData.state,
                country: budgetData.isDestination ? budgetData.country : "United States",
                isDestination: budgetData.isDestination,
                weddingDate: budgetData.weddingDate
              },
              dayOfWeek: 'saturday'
            }
          }}
        />
      </div>
    </div>
  );
}

