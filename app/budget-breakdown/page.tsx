"use client"

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { storage } from "@/lib/storage";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronRight, FileSpreadsheet, Download, AlertTriangle, Settings2, Bot } from "lucide-react";
import type { BudgetCategory, BudgetData, UserData } from "@/types/budget";
import { cn } from "@/lib/utils";
import { BudgetAssistant } from "@/components/budget/budget-assistant";
import budgetStorage, { 
  serviceMultipliers,
  type CateringStyle,
  type BarService,
  type TransportationType,
  type PhotoVideo,
  type Coverage,
  type FloralStyle,
  type WeddingPartySize,
  type CeremonyDecorLevel,
  type AdditionalDecorAreas,
  type MusicChoice,
  type BeautyStyle,
  type StationeryType,
  type SaveTheDateType,
  type InvitationType,
  type PlannerType,
  type EntertainmentType,
  type BeautyCoverage
} from "@/lib/budget-storage";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const initialBudgetData: BudgetData = {
  totalBudget: 0,
  budget: 0,
  guestCount: 0,
  location: {
    city: "",
    state: "",
    country: "United States",
    isDestination: false,
    weddingDate: new Date().toISOString().split('T')[0]
  },
  priorities: [],
  categories: [],
  rationale: {
    totalBudget: "0",
    locationFactor: 1,
    seasonalFactor: 1,
    notes: []
  },
  calculatedBudget: {
    categories: [],
    rationale: {
      totalBudget: "0",
      locationFactor: 1,
      seasonalFactor: 1,
      notes: []
    },
    dayOfWeek: "saturday",
    adjustedFactors: {
      seasonal: 1,
      location: 1
    },
    location: {
      city: "",
      state: "",
      country: "United States",
      isDestination: false,
      weddingDate: new Date().toISOString().split('T')[0]
    }
  },
  preferences: {},
  lastUpdated: new Date().toISOString()
};

export default function BudgetBreakdownPage() {
  const [budgetData, setBudgetData] = useState<BudgetData>(initialBudgetData);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const userData = storage.getUserData() as UserData;
      if (userData) {
        const transformedData: BudgetData = {
          budget: userData.budget || 0,
          totalBudget: userData.totalBudget || userData.budget || 0,
          guestCount: userData.guestCount || 0,
          location: userData.calculatedBudget?.location || userData.location || initialBudgetData.location,
          priorities: [],
          categories: [],
          rationale: {
            totalBudget: userData.calculatedBudget?.rationale?.totalBudget || "0",
            locationFactor: userData.calculatedBudget?.rationale?.locationFactor || 1,
            seasonalFactor: userData.calculatedBudget?.rationale?.seasonalFactor || 1,
            notes: userData.calculatedBudget?.rationale?.notes || []
          },
          preferences: userData.preferences || {},
          calculatedBudget: {
            categories: userData.calculatedBudget?.categories || [],
            rationale: {
              totalBudget: userData.calculatedBudget?.rationale?.totalBudget || "0",
              locationFactor: userData.calculatedBudget?.rationale?.locationFactor || 1,
              seasonalFactor: userData.calculatedBudget?.rationale?.seasonalFactor || 1,
              notes: userData.calculatedBudget?.rationale?.notes || []
            },
            dayOfWeek: userData.calculatedBudget?.dayOfWeek || "saturday",
            adjustedFactors: {
              seasonal: userData.calculatedBudget?.adjustedFactors?.seasonal || 1,
              location: userData.calculatedBudget?.adjustedFactors?.location || 1
            },
            location: userData.calculatedBudget?.location || userData.location || initialBudgetData.location
          },
          lastUpdated: userData.lastUpdated || new Date().toISOString()
        };
        setBudgetData(transformedData);
      } else {
        setError("No budget data found. Please complete the budget questionnaire first.");
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
      setError("There was an error loading your budget data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-red-100">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
          </div>
          <p className="text-sage-700 mb-6">{error}</p>
          <Button asChild className="w-full">
            <Link href="/dashboard/budget">
              Go to Budget Questionnaire
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-sage-700 mb-2">Loading Your Budget</h2>
        <p className="text-sage-600">Please wait while we prepare your budget breakdown...</p>
      </div>
    );
  }

  if (!budgetData?.calculatedBudget) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl font-semibold mb-4">No Budget Data Found</h1>
        <p className="text-sage-600 mb-6">Please complete the budget questionnaire first.</p>
        <Button asChild>
          <Link 
            href={{
              pathname: '/dashboard/budget',
              query: { 
                step: 'final',
                prefill: 'true',
                budget: budgetData?.totalBudget,
                guestCount: budgetData?.guestCount,
                city: budgetData?.location?.city,
                state: budgetData?.location?.state,
                isDestination: budgetData?.location?.country !== 'United States',
                weddingDate: budgetData?.calculatedBudget?.location?.weddingDate
              }
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (amount: number) => {
    return `${Math.round(amount)}%`;
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const calculateTotalEstimatedCost = () => {
    return budgetData.calculatedBudget?.categories.reduce((sum, category) => 
      sum + category.estimatedCost, 0
    ) || 0;
  };

  const totalEstimatedCost = calculateTotalEstimatedCost();
  const isOverBudget = totalEstimatedCost > budgetData.totalBudget;
  const overBudgetAmount = totalEstimatedCost - budgetData.totalBudget;
  const overBudgetPercentage = Math.round((overBudgetAmount / budgetData.totalBudget) * 100);

  const getCategoryStep = (categoryId: string): string => {
    const stepMap: Record<string, string> = {
      'venue': 'venue',
      'catering': 'catering',
      'photography': 'photo-video',
      'videography': 'photo-video',
      'flowers': 'decor',
      'music': 'entertainment',
      'transportation': 'transportation',
      'attire': 'attire',
      'beauty': 'beauty',
      'stationery': 'stationery',
      'favors': 'favors',
      'planning': 'planning'
    };
    return stepMap[categoryId] || 'preferences';
  };

  const handleExport = () => {
    if (!budgetData?.calculatedBudget?.categories) return;
    
    const csvContent = [
      ['Category', 'Estimated Cost', 'Percentage of Budget', 'Notes'],
      ...budgetData.calculatedBudget.categories.map(category => [
        category.name,
        category.estimatedCost,
        ((category.estimatedCost / budgetData.totalBudget) * 100).toFixed(1) + '%',
        category.notes || ''
      ])
    ]
    .map(row => row.join(','))
    .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wedding_budget_breakdown_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBudgetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sage-100/80 via-[#E8F3E9] to-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link 
                href={{
                  pathname: '/dashboard/budget/summary',
                  query: { 
                    fromBreakdown: 'true'
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Your Wedding Budget Breakdown</h1>
              <p className="text-sage-600">
                Based on your preferences and location, here's how we recommend allocating your {formatCurrency(budgetData.totalBudget)} budget
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Spreadsheet View
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
              onClick={() => {
                if (window.confirm('Are you sure you want to start over? This will reset all your budget data.')) {
                  storage.clearUserData();
                  window.location.href = '/dashboard/budget';
                }
              }}
            >
              Start Over
            </Button>
          </div>
        </div>

        {/* Budget Overview */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
              Budget Overview
              <Button variant="outline" className="flex items-center gap-2">
                <span className="text-yellow-600">💡</span>
                Quick Tips
              </Button>
            </h2>

            {isOverBudget && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2 text-red-700 mb-2">
                  <AlertTriangle className="h-5 w-5 mt-0.5" />
                  <h3 className="font-medium">
                    Budget Alert: {formatCurrency(overBudgetAmount)} over budget ({overBudgetPercentage}%)
                  </h3>
                </div>
                <ul className="space-y-1 text-red-600 ml-7">
                  <li>Consider switching to buffet-style service to save 20-30% on catering costs</li>
                  <li>Consider venues in nearby areas with lower cost factors</li>
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="text-sage-600 text-sm font-medium">Total Budget</h3>
                <p className="text-2xl font-semibold">{formatCurrency(budgetData.totalBudget)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="text-sage-600 text-sm font-medium">Guest Count & Date</h3>
                <p className="text-xl font-medium">{budgetData.guestCount} guests</p>
                <p className="text-sage-600">
                  {new Date(budgetData.location.weddingDate || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="text-sage-600 text-sm font-medium">Location</h3>
                <p className="text-xl font-medium">
                  {budgetData.location.city ? `${budgetData.location.city}, ${budgetData.location.state}` : 'Location not set'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <div className="bg-white rounded-lg border">
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium">
            <div className="col-span-4">Category</div>
            <div className="col-span-4">Estimated Cost</div>
            <div className="col-span-3">% of Budget</div>
            <div className="col-span-1">Actions</div>
          </div>

          <div className="divide-y">
            {budgetData.calculatedBudget.categories.map((category) => (
              <div key={category.id}>
                <div 
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="col-span-4 flex items-center gap-2">
                    {expandedCategories.includes(category.id) ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                    <span className="text-green-600 font-medium">
                      {category.id === 'hair_makeup' ? 'Hair and Makeup' : category.name}
                    </span>
                  </div>
                  <div className="col-span-4 font-medium">
                    {formatCurrency(category.estimatedCost)}
                  </div>
                  <div className="col-span-3">
                    {formatPercentage(category.percentage)}
                  </div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">Category actions</span>
                      ⋮
                    </Button>
                  </div>
                </div>

                {/* Expanded Category Details */}
                {expandedCategories.includes(category.id) && (
                  <div className="p-6 bg-sage-50/50 border-t">
                    <div className="w-full">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Info - Takes full width */}
                        <div className="lg:col-span-3 space-y-6">
                          <div className="bg-white rounded-lg p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-semibold text-sage-700">About This Category</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-sage-500">Edit via:</span>
                                <Button variant="outline" size="sm" className="h-7">
                                  UI
                                </Button>
                                <Button variant="outline" size="sm" className="h-7">
                                  Assistant
                                </Button>
                              </div>
                            </div>
                            <p className="text-sage-600 mb-4">{category.rationale}</p>
                            
                            <div className="border-t pt-4 mt-4">
                              <h5 className="text-sm font-medium text-sage-700 mb-2">Cost Impact of Your Choices</h5>
                              <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3">Cost Impact of Your Choices</h3>
                                <div className="space-y-4">
                                  {category.id === 'photography' && (
                                    <>
                                      <p>Your photography choices impact costs in the following ways:</p>
                                      <ul className="list-disc pl-5 space-y-2">
                                        <li>Service Type: {budgetData.preferences?.photoVideo || 'Not specified'} - {budgetData.preferences?.photoVideo ? serviceMultipliers.photography[budgetData.preferences.photoVideo as PhotoVideo] : 1}x base rate</li>
                                        <li>Coverage Duration: {budgetData.preferences?.coverage || 'Not specified'} - {budgetData.preferences?.coverage ? serviceMultipliers.coverage[budgetData.preferences.coverage as Coverage] : 1}x base rate</li>
                                        <li>Guest Count Impact: {budgetData.guestCount} guests require additional coverage and editing time</li>
                                      </ul>
                                    </>
                                  )}
                                  
                                  {category.id === 'catering' && (
                                    <>
                                      <p>Your catering choices affect costs as follows:</p>
                                      <ul className="list-disc pl-5 space-y-2">
                                        <li>Service Style: {budgetData.preferences?.cateringStyle || 'Not specified'} - {budgetData.preferences?.cateringStyle ? serviceMultipliers.catering[budgetData.preferences.cateringStyle as CateringStyle] : 1}x base rate</li>
                                        <li>Bar Service: {budgetData.preferences?.barService || 'Not specified'} - {budgetData.preferences?.barService ? serviceMultipliers.bar[budgetData.preferences.barService as BarService] : 1}x base rate</li>
                                        <li>Guest Count Impact: {budgetData.guestCount} guests affect food quantity and staffing needs</li>
                                      </ul>
                                      <div className="mt-4">
                                        <Button variant="outline" size="sm" asChild>
                                          <Link href={{
                                            pathname: '/dashboard/budget',
                                            query: { 
                                              step: 'catering',
                                              prefill: 'true',
                                              cateringStyle: budgetData.preferences?.cateringStyle,
                                              barService: budgetData.preferences?.barService
                                            }
                                          }}>
                                            Update Catering Preferences
                                          </Link>
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                  
                                  {category.id === 'transportation' && (
                                    <>
                                      <p>Your transportation choices influence costs in these ways:</p>
                                      <ul className="list-disc pl-5 space-y-2">
                                        <li>Service Type: {budgetData.preferences?.transportationType || 'Not specified'} - {budgetData.preferences?.transportationType ? serviceMultipliers.transportation[budgetData.preferences.transportationType as TransportationType] : 1}x base rate</li>
                                        <li>Guest Count: {budgetData.preferences?.transportationGuestCount || 'Not specified'} guests requiring transportation</li>
                                        <li>Service Duration: {budgetData.preferences?.transportationHours || 'Not specified'} hours of service needed</li>
                                      </ul>
                                      <div className="mt-4">
                                        <Button variant="outline" size="sm" asChild>
                                          <Link href={{
                                            pathname: '/dashboard/budget',
                                            query: { 
                                              step: 'transportation',
                                              prefill: 'true',
                                              transportationType: budgetData.preferences?.transportationType,
                                              transportationGuestCount: budgetData.preferences?.transportationGuestCount,
                                              transportationHours: budgetData.preferences?.transportationHours
                                            }
                                          }}>
                                            Update Transportation Preferences
                                          </Link>
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                  
                                  {category.id === 'flowers' && (
                                    <>
                                      <p>Your floral choices impact costs as follows:</p>
                                      <ul className="list-disc pl-5 space-y-2">
                                        <li>Floral Style: {budgetData.preferences?.floralStyle || 'Not specified'} - {budgetData.preferences?.floralStyle ? serviceMultipliers.florals[budgetData.preferences.floralStyle as FloralStyle] : 1}x base rate</li>
                                        <li>DIY Elements: {budgetData.preferences?.diyElements || 'Not specified'} - {budgetData.preferences?.diyElements === 'Yes, planning DIY elements' ? 0.7 : budgetData.preferences?.diyElements === 'Maybe, still deciding' ? 0.9 : 1}x base rate</li>
                                        <li>Wedding Party Size: {budgetData.preferences?.weddingPartySize || 'Not specified'} affects bouquet and boutonniere quantities</li>
                                      </ul>
                                      <div className="mt-4">
                                        <Button variant="outline" size="sm" asChild>
                                          <Link href={{
                                            pathname: '/dashboard/budget',
                                            query: { 
                                              step: 'decor',
                                              prefill: 'true',
                                              floralStyle: budgetData.preferences?.floralStyle,
                                              diyElements: budgetData.preferences?.diyElements,
                                              weddingPartySize: budgetData.preferences?.weddingPartySize
                                            }
                                          }}>
                                            Update Floral Preferences
                                          </Link>
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                  
                                  {category.id === 'entertainment' && (
                                    <>
                                      <p>Your entertainment choices affect costs in these ways:</p>
                                      <ul className="list-disc pl-5 space-y-2">
                                        <li>Reception Entertainment: {budgetData.preferences?.entertainment || 'Not specified'} - {
                                          (() => {
                                            const choice = budgetData.preferences?.entertainment;
                                            switch(choice) {
                                              case 'DJ only': return 'Average cost $1,500-2,500';
                                              case 'Band only': return 'Average cost $4,000-8,000';
                                              case 'Both DJ and Band': return 'Average cost $6,000-10,000';
                                              case 'No live music': return 'Average cost $500-1,000 (sound system rental)';
                                              default: return 'Average cost varies by choice';
                                            }
                                          })()
                                        }</li>
                                        <li>Ceremony Music: {budgetData.preferences?.musicChoice || 'Not specified'}</li>
                                        <li>Guest Count Impact: {budgetData.guestCount} guests affect equipment and performance needs</li>
                                      </ul>
                                      <div className="mt-4">
                                        <Button variant="outline" size="sm" asChild>
                                          <Link href={{
                                            pathname: '/dashboard/budget',
                                            query: { 
                                              step: 'entertainment',
                                              prefill: 'true',
                                              entertainment: budgetData.preferences?.entertainment,
                                              musicChoice: budgetData.preferences?.musicChoice
                                            }
                                          }}>
                                            Update Entertainment Preferences
                                          </Link>
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                  
                                  {category.id === 'hair_makeup' && (
                                    <>
                                      <p>Your beauty service choices influence costs as follows:</p>
                                      <ul className="list-disc pl-5 space-y-2">
                                        <li>Service Style: {budgetData.preferences?.beautyStyle || 'Not specified'} - {budgetData.preferences?.beautyStyle ? serviceMultipliers.beauty[budgetData.preferences.beautyStyle as BeautyStyle] : 1}x base rate</li>
                                        <li>Coverage: {budgetData.preferences?.beautyCoverage || 'Not specified'} affects the number of services needed</li>
                                        <li>Wedding Party Size: {budgetData.preferences?.weddingPartySize || 'Not specified'} determines total service count</li>
                                      </ul>
                                      <div className="mt-4">
                                        <Button variant="outline" size="sm" asChild>
                                          <Link href={{
                                            pathname: '/dashboard/budget',
                                            query: { 
                                              step: 'beauty',
                                              prefill: 'true',
                                              beautyStyle: budgetData.preferences?.beautyStyle,
                                              beautyCoverage: budgetData.preferences?.beautyCoverage,
                                              makeupFor: budgetData.preferences?.makeupFor,
                                              makeupServices: budgetData.preferences?.makeupServices
                                            }
                                          }}>
                                            Update Hair and Makeup Preferences
                                          </Link>
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                  
                                  {category.id === 'stationery' && (
                                    <>
                                      <p>Your stationery choices impact costs in these ways:</p>
                                      <ul className="list-disc pl-5 space-y-2">
                                        <li>Stationery Type: {budgetData.preferences?.stationeryType || 'Not specified'} - {budgetData.preferences?.stationeryType ? serviceMultipliers.stationery[budgetData.preferences.stationeryType as StationeryType] : 1}x base rate</li>
                                        <li>Save the Dates: {budgetData.preferences?.saveTheDateType || 'Not specified'} - {budgetData.preferences?.saveTheDateType ? serviceMultipliers.saveTheDate[budgetData.preferences.saveTheDateType as SaveTheDateType] : 1}x base rate</li>
                                        <li>Guest Count Impact: {budgetData.guestCount} guests affect invitation quantity needs</li>
                                      </ul>
                                      <div className="mt-4">
                                        <Button variant="outline" size="sm" asChild>
                                          <Link href={{
                                            pathname: '/dashboard/budget',
                                            query: { 
                                              step: 'stationery',
                                              prefill: 'true',
                                              stationeryType: budgetData.preferences?.stationeryType,
                                              saveTheDateType: budgetData.preferences?.saveTheDateType,
                                              invitationType: budgetData.preferences?.invitationType
                                            }
                                          }}>
                                            Update Stationery Preferences
                                          </Link>
                                        </Button>
                                      </div>
                                    </>
                                  )}

                                  {category.id === 'attire' && (
                                    <>
                                      <p>Your attire costs are based on the following budget allocations:</p>
                                      <ul className="list-disc pl-5 space-y-2">
                                        <li>Wedding Dress Budget: {formatCurrency(Number(budgetData.preferences?.dressBudget || 0))}</li>
                                        <li>Suit Budget: {formatCurrency(Number(budgetData.preferences?.suitBudget || 0))}</li>
                                        <li>Accessories Budget: {formatCurrency(Number(budgetData.preferences?.accessoriesBudget || 0))}</li>
                                        {budgetData.preferences?.needAlterations && (
                                          <li>Alterations: Included in dress budget</li>
                                        )}
                                        {budgetData.preferences?.needReceptionDress && (
                                          <li>Reception Dress Budget: {formatCurrency(Number(budgetData.preferences?.receptionDressBudget || 0))}</li>
                                        )}
                                        <li>Number of Suits Needed: {budgetData.preferences?.suitCount || 1}</li>
                                      </ul>
                                      <div className="mt-4 p-3 bg-sage-50 rounded-lg">
                                        <p className="text-sm text-sage-700">
                                          Total Attire Budget: {formatCurrency(category.estimatedCost)}
                                        </p>
                                      </div>
                                      <div className="mt-4">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          asChild
                                        >
                                          <Link 
                                            href={{
                                              pathname: '/dashboard/budget',
                                              query: { 
                                                step: 'attire',
                                                prefill: 'true',
                                                dressBudget: budgetData.preferences?.dressBudget,
                                                suitBudget: budgetData.preferences?.suitBudget,
                                                accessoriesBudget: budgetData.preferences?.accessoriesBudget,
                                                needAlterations: budgetData.preferences?.needAlterations,
                                                needReceptionDress: budgetData.preferences?.needReceptionDress,
                                                receptionDressBudget: budgetData.preferences?.receptionDressBudget,
                                                suitCount: budgetData.preferences?.suitCount
                                              }
                                            }}
                                          >
                                            Update Attire Preferences
                                          </Link>
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {['venue', 'catering', 'transportation'].includes(category.id) && (
                            <div className="bg-white rounded-lg p-5 shadow-sm">
                              <h4 className="text-sm font-semibold text-sage-700 mb-3 flex items-center gap-2">
                                <span className="inline-block">📍</span>
                                Location & Timing Impact
                              </h4>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-sage-600">Location Factor</span>
                                    <span className="font-medium text-sage-900">{budgetData.calculatedBudget.rationale.locationFactor}x</span>
                                  </div>
                                  {budgetData.calculatedBudget.rationale.locationFactor > 1.2 && (
                                    <p className="text-sm text-sage-500 bg-sage-50 p-2 rounded">
                                      {category.name} costs are typically higher in {budgetData.location.city}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-sage-600">Seasonal Factor</span>
                                    <span className="font-medium text-sage-900">{budgetData.calculatedBudget.rationale.seasonalFactor}x</span>
                                  </div>
                                  {budgetData.calculatedBudget.rationale.seasonalFactor > 1 && (
                                    <p className="text-sm text-sage-500 bg-sage-50 p-2 rounded">
                                      Peak season pricing applies for your date
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Make Changes Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-sage-900">Make Changes to Your Budget</h2>
              <p className="text-sage-600">Choose how you'd like to modify your budget:</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sage-600"></div>
                <span className="text-sm text-sage-600">UI Controls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sage-400"></div>
                <span className="text-sm text-sage-600">AI Assistant</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-sage-200/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-sage-50 to-sage-100/50 border-b border-sage-200/50">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-sage-700" />
                  <CardTitle className="text-sage-900">Using the UI</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-sage-600">
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 mt-1">•</span>
                    Click on any category to see detailed breakdown
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 mt-1">•</span>
                    Update preferences to adjust costs
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 mt-1">•</span>
                    See how your choices affect the budget
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 mt-1">•</span>
                    Track actual spending vs estimates
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-sage-200/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-sage-50 to-sage-100/50 border-b border-sage-200/50">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-sage-700" />
                  <CardTitle className="text-sage-900">Using the AI Assistant</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-sage-600">
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 mt-1">•</span>
                    Ask questions about your budget in natural language
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 mt-1">•</span>
                    Get personalized suggestions for optimization
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 mt-1">•</span>
                    Request changes to multiple categories at once
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-500 mt-1">•</span>
                    Compare different options and their costs
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <BudgetAssistant 
          budgetData={budgetData} 
          onUpdateBudget={(updates) => {
            const updatedBudgetData = {
              ...budgetData,
              ...updates,
              lastUpdated: new Date().toISOString()
            };
            storage.setUserData(updatedBudgetData);
            setBudgetData(updatedBudgetData);
          }}
        />
      </div>
    </div>
  );
}