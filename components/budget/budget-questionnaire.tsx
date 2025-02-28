"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BudgetData } from "@/types/budget"
import { storage } from "@/lib/storage"
import budgetStorage from "@/lib/budget-storage"
import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface BudgetFormData {
  totalBudget: string;
  guestCount: string;
  weddingDate: string;
  isDestination: boolean;
  city: string;
  state: string;
  country: string;
  cateringType: string;
  barType: string;
  photoVideo: string;
  coverage: string;
  floralStyle: string;
  diyElements: string;
  musicChoice: string;
  beautyCoverage: string;
  planningAssistance: string;
}

const BudgetSurvey = () => {
  const [step, setStep] = useState(0);
  const [budgetData, setBudgetData] = useState<BudgetFormData>({
    totalBudget: '',
    guestCount: '',
    weddingDate: '',
    isDestination: false,
    city: '',
    state: '',
    country: '',
    cateringType: '',
    barType: '',
    photoVideo: '',
    coverage: '',
    floralStyle: '',
    diyElements: '',
    musicChoice: '',
    beautyCoverage: '',
    planningAssistance: '',
  });

  // Load initial user data
  useEffect(() => {
    const userData = storage.getUserData();
    if (userData) {
      setBudgetData(prevData => ({
        ...prevData,
        totalBudget: userData.budget ? userData.budget.toString() : '',
        guestCount: userData.guestCount ? userData.guestCount.toString() : '',
        weddingDate: userData.weddingDate ? userData.weddingDate.split('T')[0] : '',
      }));
    }
  }, []);

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
      // Parse the total budget as a number
      const totalBudget = parseFloat(budgetData.totalBudget.replace(/[^0-9.]/g, ''));
      
      if (isNaN(totalBudget)) {
        alert('Please enter a valid total budget');
        return;
      }

      // Create location data
      const locationData = {
        city: budgetData.city,
        state: budgetData.state,
        country: budgetData.isDestination ? budgetData.country : "United States"
      };

      // Create priorities array based on user selections
      const priorities = [];
      
      if (budgetData.photoVideo === "Both Photography & Videography") {
        priorities.push("photography");
      }
      if (budgetData.floralStyle === "Elaborate & Luxurious") {
        priorities.push("florals");
      }
      if (budgetData.musicChoice === "Live Band" || budgetData.musicChoice === "Both DJ & Band") {
        priorities.push("entertainment");
      }
      if (budgetData.planningAssistance === "Full Wedding Planner") {
        priorities.push("planner");
      }

      // Calculate the budget
      const result = budgetStorage.calculateBudget(totalBudget, locationData, priorities);

      // Store the result in localStorage for the breakdown page
      storage.setUserData({
        budget: totalBudget,
        weddingDate: budgetData.weddingDate,
        guestCount: parseInt(budgetData.guestCount) || 0,
        calculatedBudget: result
      });

      // Navigate to the budget breakdown page
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

  // Add predefined options
  const CATERING_OPTIONS = ["Plated", "Buffet", "Family Style", "Food Stations", "Heavy Appetizers"];
  const BAR_OPTIONS = ["Full Open Bar", "Beer & Wine Only", "Limited Open Bar", "Cash Bar", "No Alcohol"];
  const PHOTO_VIDEO_OPTIONS = ["Both Photography & Videography", "Photography Only", "Videography Only"];
  const COVERAGE_OPTIONS = ["Full Day Coverage", "Partial Day Coverage", "Ceremony & Portraits Only"];
  const FLORAL_STYLE_OPTIONS = ["Elaborate & Luxurious", "Modern & Minimalist", "Garden Style", "Wildflower Style", "Simple & Classic"];
  const DIY_OPTIONS = ["Yes, planning DIY elements", "No DIY elements planned", "Maybe, still deciding"];
  const MUSIC_OPTIONS = ["DJ", "Live Band", "Both DJ & Band", "Other Live Music", "Playlist Only"];
  const BEAUTY_COVERAGE_OPTIONS = ["Full Wedding Party", "Bride Only", "Bride & Bridesmaids", "None Needed"];
  const PLANNER_OPTIONS = ["Full Wedding Planner", "Month-of Coordinator", "Day-of Coordinator", "No Professional Help"];

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
                This might seem like a lot of questions, but it'll only take about 5 minutes. If you don't know the answer, go with your best guess for now. You can always change it later!
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <Progress value={((step) / 8) * 100} className="flex-1 bg-sage-200 [&>[role=progressbar]]:bg-sage-700" />
          <span className="text-sm font-medium text-sage-600">{step + 1}/8</span>
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
                <p className="text-sm text-sage-600">
                  This affects venue size, catering costs, and other per-person expenses.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Maximum Budget</Label>
                <Input
                  type="text"
                  name="totalBudget"
                  value={budgetData.totalBudget}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-sage-600">
                  This helps us ensure our recommendations stay within your comfort zone.
                </p>
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
              <CardTitle>General Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Maximum Budget</Label>
                <p className="text-sm text-sage-600">What's the maximum amount you're willing to spend on your wedding? This helps us ensure our recommendations stay within your comfort zone. You can always adjust this later.</p>
                <Input
                  type="text"
                  name="totalBudget"
                  placeholder="Enter amount"
                  value={budgetData.totalBudget}
                  onChange={handleInputChange}
                />
              </div>

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

              {budgetData.isDestination ? (
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
              ) : (
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

                  <div className="space-y-2">
                <Label>Guest Count</Label>
                <p className="text-sm text-sage-600">The number of guests impacts catering, venue size, and other per-person costs.</p>
                    <Input
                  type="number"
                  name="guestCount"
                  placeholder="Guest Count"
                  value={budgetData.guestCount}
                  onChange={handleInputChange}
                    />
                  </div>

              <div className="space-y-2">
                <Label>Wedding Date</Label>
                <p className="text-sm text-sage-600">Seasonal demand can affect pricing for venues and services.</p>
                <Input
                  type="date"
                  name="weddingDate"
                  value={budgetData.weddingDate}
                  onChange={handleInputChange}
                />
            </div>
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
                <p className="text-sm text-sage-600">Capturing memories can be done through photos, videos, or both.</p>
                <Select
                  value={budgetData.photoVideo}
                  onValueChange={(value) => setBudgetData(prev => ({ ...prev, photoVideo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select coverage type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PHOTO_VIDEO_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Coverage Length</Label>
                <p className="text-sm text-sage-600">Full-day coverage ensures all moments are captured, but may cost more.</p>
                <Select
                  value={budgetData.coverage}
                  onValueChange={(value) => setBudgetData(prev => ({ ...prev, coverage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select coverage length" />
                  </SelectTrigger>
                  <SelectContent>
                    {COVERAGE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
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
                <p className="text-sm text-sage-600">Floral arrangements can range from simple to extravagant.</p>
                <Select
                  value={budgetData.floralStyle}
                  onValueChange={(value) => setBudgetData(prev => ({ ...prev, floralStyle: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select floral style" />
                  </SelectTrigger>
                  <SelectContent>
                    {FLORAL_STYLE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>DIY Elements</Label>
                <p className="text-sm text-sage-600">DIY can save costs but requires time and effort.</p>
                <Select
                  value={budgetData.diyElements}
                  onValueChange={(value) => setBudgetData(prev => ({ ...prev, diyElements: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select DIY preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIY_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
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
              <CardTitle>Entertainment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Music Choice</Label>
                <p className="text-sm text-sage-600">Music choice can set the tone for your reception.</p>
                <Select
                  value={budgetData.musicChoice}
                  onValueChange={(value) => setBudgetData(prev => ({ ...prev, musicChoice: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select music option" />
                  </SelectTrigger>
                  <SelectContent>
                    {MUSIC_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
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
              <CardTitle>Attire & Beauty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Hair & Makeup Coverage</Label>
                <p className="text-sm text-sage-600">Decide if you'll cover beauty costs for your party.</p>
                <Select
                  value={budgetData.beautyCoverage}
                  onValueChange={(value) => setBudgetData(prev => ({ ...prev, beautyCoverage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select beauty coverage" />
                  </SelectTrigger>
                  <SelectContent>
                    {BEAUTY_COVERAGE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 6 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Logistics & Miscellaneous</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Wedding Planner</Label>
                <p className="text-sm text-sage-600">Decide on the level of planning assistance needed.</p>
                <Select
                  value={budgetData.planningAssistance}
                  onValueChange={(value) => setBudgetData(prev => ({ ...prev, planningAssistance: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select planner type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLANNER_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Catering Style</Label>
                <p className="text-sm text-sage-600">Choose your preferred dining style for the reception.</p>
                <Select
                  value={budgetData.cateringType}
                  onValueChange={(value) => setBudgetData(prev => ({ ...prev, cateringType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select catering style" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATERING_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  </div>

              <div className="space-y-2">
                <Label>Bar Service</Label>
                <p className="text-sm text-sage-600">Choose your preferred bar service option.</p>
                <Select
                  value={budgetData.barType}
                  onValueChange={(value) => setBudgetData(prev => ({ ...prev, barType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bar service" />
                  </SelectTrigger>
                  <SelectContent>
                    {BAR_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 7 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-sage-600">Review your inputs before we calculate your personalized budget</p>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Location Details</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
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
                      <p className="font-medium">{budgetData.guestCount || 0} guests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Photography & Videography</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
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
                  <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
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
                      <Label className="text-sage-600">DIY Elements</Label>
                      <p className="font-medium">{budgetData.diyElements || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Entertainment</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setStep(4)}>
                    <Pencil className="h-4 w-4 text-sage-600" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sage-600">Music Choice</Label>
                    <p className="font-medium">{budgetData.musicChoice || "Not specified"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Attire & Beauty</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setStep(5)}>
                    <Pencil className="h-4 w-4 text-sage-600" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sage-600">Hair & Makeup Coverage</Label>
                    <p className="font-medium">{budgetData.beautyCoverage || "Not specified"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Logistics & Catering</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setStep(6)}>
                    <Pencil className="h-4 w-4 text-sage-600" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sage-600">Wedding Planner</Label>
                      <p className="font-medium">{budgetData.planningAssistance || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Catering Style</Label>
                      <p className="font-medium">{budgetData.cateringType || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600">Bar Service</Label>
                      <p className="font-medium">{budgetData.barType || "Not specified"}</p>
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
            disabled={step === 1}
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
            <Button
              onClick={step === 7 ? calculateBudget : handleNextStep}
            className="w-full sm:w-auto bg-[#738678] hover:bg-[#4A5D4E] text-white"
          >
              {step === 7 ? "Calculate Budget" : "Next"}
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSurvey;

