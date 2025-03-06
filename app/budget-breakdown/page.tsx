"use client"

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { storage } from "@/lib/storage";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronRight, FileSpreadsheet, Download, AlertTriangle } from "lucide-react";
import type { BudgetCategory, BudgetData, UserData } from "@/types/budget";
import { cn } from "@/lib/utils";

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
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sage-100/80 via-[#E8F3E9] to-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link 
                href={{
                  pathname: '/dashboard/budget',
                  query: { 
                    step: '11',
                    prefill: 'true',
                    budget: budgetData.totalBudget,
                    guestCount: budgetData.guestCount,
                    city: budgetData.location.city,
                    state: budgetData.location.state,
                    isDestination: budgetData.location.country !== 'United States',
                    weddingDate: budgetData.location.weddingDate,
                    fromSummary: 'true'
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
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="destructive" className="flex items-center gap-2">
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
                    <span className="text-green-600 font-medium">{category.name}</span>
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
                        {/* Main Info - Takes 2 columns on large screens */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="bg-white rounded-lg p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-sage-700 mb-3">About This Category</h4>
                            <p className="text-sage-600 mb-4">{category.rationale}</p>
                            
                            <div className="border-t pt-4 mt-4">
                              <h5 className="text-sm font-medium text-sage-700 mb-2">Cost Breakdown</h5>
                              <p className="text-sage-600">{category.notes}</p>
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

                        {/* Cost Optimization - Takes 1 column */}
                        <div className="lg:col-span-1">
                          <div className="bg-white rounded-lg p-5 shadow-sm sticky top-6">
                            <h4 className="text-sm font-semibold text-sage-700 mb-3 flex items-center gap-2">
                              <span className="inline-block">💰</span>
                              Cost Optimization
                            </h4>
                            
                            <div className="space-y-4">
                              {/* Current Selection */}
                              <div className="p-3 bg-sage-50 rounded-md">
                                <h5 className="text-sm font-medium text-sage-700 mb-1">Current Selection</h5>
                                <p className="text-sm text-sage-600">
                                  {category.currentChoice || `Standard ${category.name.toLowerCase()} package`}
                                </p>
                              </div>

                              {/* Cost-saving Alternatives */}
                              {category.alternatives && category.alternatives.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium text-sage-700 mb-2">Available Alternatives</h5>
                                  <ul className="space-y-3">
                                    {category.alternatives.map((alternative, index) => (
                                      <li key={index} className="flex items-start gap-2 text-sm">
                                        <span className="text-green-600 mt-1">↓</span>
                                        <div>
                                          <p className="text-sage-700 font-medium">{alternative.option}</p>
                                          <p className="text-sage-500">Save {alternative.savings}%</p>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Quick Actions */}
                              <div className="pt-4 mt-4 border-t">
                                <Button variant="outline" className="w-full justify-start text-left" asChild>
                                  <Link
                                    href={{
                                      pathname: '/dashboard/budget',
                                      query: {
                                        step: getCategoryStep(category.id),
                                        prefill: 'true',
                                        budget: budgetData.totalBudget,
                                        guestCount: budgetData.guestCount,
                                        city: budgetData.location.city,
                                        state: budgetData.location.state,
                                        isDestination: budgetData.location.country !== 'United States',
                                        weddingDate: budgetData.location.weddingDate,
                                        returnTo: '/budget-breakdown'
                                      }
                                    }}
                                  >
                                    <span className="mr-2">✏️</span>
                                    Adjust {category.name} Preferences
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}