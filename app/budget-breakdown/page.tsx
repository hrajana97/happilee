"use client"

import React, { useEffect, useState } from 'react';
import { storage } from "@/lib/storage";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, FileSpreadsheet, Download, Calendar, Users, MapPin, Plus, MoreVertical } from "lucide-react";
import Link from "next/link";
import type { BudgetCategory, BudgetData } from "@/types/budget";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import budgetStorage from "@/lib/budget-storage";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  impactedCategories: string[];
}

interface UserData {
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
    totalBudget: string;
    locationFactor: number;
    seasonalFactor: number;
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
  };
}

export default function BudgetBreakdownPage() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [editedPreferences, setEditedPreferences] = useState({
    guestCount: 0,
    weddingDate: '',
    city: '',
    state: '',
    country: '',
    isDestination: false
  });
  const [impactedCategories, setImpactedCategories] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isHowToUseExpanded, setIsHowToUseExpanded] = useState(false);

  useEffect(() => {
    try {
      const userData = storage.getUserData();
      if (userData?.calculatedBudget) {
        // Transform UserData into BudgetData with proper type checking
        const transformedData: BudgetData = {
          totalBudget: userData.budget || 0,
          budget: userData.budget || 0,
          location: userData.calculatedBudget.location || {
            city: "Austin",
            state: "Texas",
            country: "United States",
            isDestination: false
          },
          guestCount: userData.guestCount || 0,
          priorities: [],
          categories: userData.calculatedBudget.categories || [],
          lastUpdated: new Date().toISOString(),
          rationale: {
            totalBudget: (userData.budget || 0).toString(),
            locationFactor: 1,
            seasonalFactor: 1,
            notes: []
          },
          calculatedBudget: {
            categories: userData.calculatedBudget.categories || [],
            rationale: {
              totalBudget: (userData.budget || 0).toString(),
              locationFactor: userData.calculatedBudget.rationale?.locationFactor || 1,
              seasonalFactor: userData.calculatedBudget.rationale?.seasonalFactor || 1,
              notes: []
            },
            location: userData.calculatedBudget.location
          }
        };
        setBudgetData(transformedData);
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (budgetData) {
      setEditedPreferences({
        guestCount: budgetData.guestCount,
        weddingDate: budgetData.calculatedBudget.location?.weddingDate || '',
        city: budgetData.calculatedBudget.location?.city || '',
        state: budgetData.calculatedBudget.location?.state || '',
        country: budgetData.calculatedBudget.location?.country || '',
        isDestination: budgetData.calculatedBudget.location?.isDestination || false
      });
    }
  }, [budgetData]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev: Record<string, boolean>) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Function to format currency without the Intl object for Excel
  const formatCurrencyRaw = (amount: number) => {
    return (Math.round(amount * 100) / 100).toFixed(2);
  };

  // Function to prepare data for export
  const prepareExportData = () => {
    if (!budgetData?.calculatedBudget?.categories) return [];
    
    // Header row
    const data = [
      ['Category', 'Estimated Cost', 'Percentage', 'Min Range', 'Max Range', 'Priority', 'Notes']
    ];
    
    // Add category rows
    budgetData.calculatedBudget.categories.forEach((category: BudgetCategory) => {
      const minRange = category.ranges ? category.ranges.min : category.estimatedCost * 0.9;
      const maxRange = category.ranges ? category.ranges.max : category.estimatedCost * 1.1;
      
      data.push([
        category.name,
        formatCurrencyRaw(category.estimatedCost),
        `${category.percentage}%`,
        formatCurrencyRaw(minRange),
        formatCurrencyRaw(maxRange),
        category.priority,
        category.notes || ''
      ]);
    });
    
    // Add summary row
    const totalBudget = budgetData.calculatedBudget.categories.reduce(
      (sum: number, cat: BudgetCategory) => sum + cat.estimatedCost, 0
    );
    
    data.push([
      'TOTAL',
      formatCurrencyRaw(totalBudget),
      '100%',
      '',
      '',
      '',
      ''
    ]);
    
    // Add metadata
    data.push(['']);
    data.push(['Wedding Budget Summary']);
    data.push(['Generated on', new Date().toLocaleDateString()]);
    data.push(['Total Budget', formatCurrencyRaw(budgetData.budget)]);
    data.push(['Guest Count', budgetData.guestCount.toString()]);
    data.push(['Per Guest Cost', formatCurrencyRaw(budgetData.budget / budgetData.guestCount)]);
    data.push(['Location Factor', budgetData.calculatedBudget.rationale.locationFactor.toString()]);
    data.push(['Seasonal Factor', budgetData.calculatedBudget.rationale.seasonalFactor.toString()]);
    
    return data;
  };

  // Function to export to CSV (for Google Sheets)
  const exportToCSV = () => {
    const data = prepareExportData();
    if (data.length === 0) {
      toast({
        title: "Export failed",
        description: "No budget data available to export",
        variant: "destructive"
      });
      return;
    }
    
    // Convert data to CSV format
    const csvContent = data.map(row => row.map(cell => {
      // Handle commas and quotes in cells
      if (cell.includes(',') || cell.includes('"')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')).join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `wedding_budget_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: "Your budget has been exported as a CSV file",
    });
  };

  // Function to export to Excel (XLSX format)
  const exportToExcel = () => {
    // This is a simplified implementation that relies on CSV
    // For a proper Excel export, you would typically use a library like xlsx or exceljs
    // Here we're using the same CSV export which can be opened in Excel
    exportToCSV();
    
    toast({
      title: "Export successful",
      description: "Your budget has been exported as a file that can be opened in Excel",
    });
  };

  const handlePreferenceUpdate = async () => {
    try {
      // Get the current budget data
      const currentData = await budgetStorage.getBudgetData();
      if (!currentData) return;

      // Update location data
      const locationData = {
        city: editedPreferences.city,
        state: editedPreferences.state,
        country: editedPreferences.country,
        isDestination: editedPreferences.isDestination,
      };

      // Recalculate budget with new preferences
      const recalculatedBudget = budgetStorage.calculateBudget(
        editedPreferences.guestCount,
        locationData,
        currentData.priorities,
        currentData.preferences
      );

      // Update the budget data
      const updatedBudgetData = {
        ...currentData,
        guestCount: editedPreferences.guestCount,
        weddingDate: editedPreferences.weddingDate,
        calculatedBudget: recalculatedBudget,
        lastUpdated: new Date().toISOString()
      };

      await budgetStorage.setBudgetData(updatedBudgetData);
      setBudgetData(updatedBudgetData);
      setIsEditingPreferences(false);
      
      toast({
        title: "Budget Updated",
        description: "Your budget has been recalculated based on the new preferences.",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your preferences. Please try again.",
        variant: "destructive"
      });
    }
  };

  const validateBudgetChange = (categoryId: string, newAmount: number): ValidationResult => {
    const category = budgetData?.calculatedBudget.categories.find((c: BudgetCategory) => c.id === categoryId);
    if (!category || !budgetData) return { isValid: false, errors: { amount: 'Invalid category' }, impactedCategories: [] };

    const errors: Record<string, string> = {};
    const totalBudget = budgetData.budget;
    const currentAllocation = category.estimatedCost;
    const minRecommended = category.ranges?.min || currentAllocation * 0.5;
    const maxRecommended = category.ranges?.max || currentAllocation * 1.5;

    // Check if amount is within reasonable range
    if (newAmount < minRecommended) {
      errors.amount = `Amount is below recommended minimum of ${formatCurrency(minRecommended)}`;
    } else if (newAmount > maxRecommended) {
      errors.amount = `Amount exceeds recommended maximum of ${formatCurrency(maxRecommended)}`;
    }

    // Check if change would impact other categories significantly
    const difference = newAmount - currentAllocation;
    const remainingCategories = budgetData.calculatedBudget.categories.filter((c: any) => c.id !== categoryId);
    const totalRemaining = remainingCategories.reduce((sum: number, c: any) => sum + c.estimatedCost, 0);
    
    const impacted = remainingCategories
      .filter((c: any) => {
        const adjustmentRatio = (c.estimatedCost / totalRemaining) * Math.abs(difference);
        return adjustmentRatio > c.estimatedCost * 0.2; // 20% threshold for significant impact
      })
      .map((c: any) => c.id);

    setImpactedCategories(impacted);

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      impactedCategories: impacted
    };
  };

  const handleCategoryUpdate = async (categoryId: string, newAmount: number) => {
    const validation = validateBudgetChange(categoryId, newAmount);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      toast({
        variant: "default",
        title: "Warning",
        description: Object.values(validation.errors)[0]
      });
    }

    if (validation.impactedCategories.length > 0) {
      const impactedNames = validation.impactedCategories
        .map(id => budgetData?.calculatedBudget.categories.find((c: any) => c.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      toast({
        title: "Category Impact Warning",
        description: `This change will significantly affect: ${impactedNames}`,
        variant: "default"
      });
    }

    // Update the category even if there are warnings
    try {
      const currentData = await budgetStorage.getBudgetData();
      if (!currentData) return;

      const updatedCategories = currentData.calculatedBudget.categories.map((c: any) =>
        c.id === categoryId
          ? { ...c, estimatedCost: newAmount, remaining: newAmount - c.actualCost }
          : c
      );

      const updatedBudgetData = {
        ...currentData,
        calculatedBudget: {
          ...currentData.calculatedBudget,
          categories: updatedCategories
        },
        lastUpdated: new Date().toISOString()
      };

      await budgetStorage.setBudgetData(updatedBudgetData);
      setBudgetData(updatedBudgetData);
      
      toast({
        title: "Budget Updated",
        description: "Category budget has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the category. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUserDataUpdate = (userData: Partial<UserData>) => {
    setBudgetData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        totalBudget: userData.budget ?? prev.totalBudget,
        budget: userData.budget ?? prev.budget,
        guestCount: userData.guestCount ?? prev.guestCount,
        calculatedBudget: {
          ...prev.calculatedBudget,
          location: userData.calculatedBudget?.location || prev.calculatedBudget.location
        }
      };
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddCategory = () => {
    const newCategory: BudgetCategory = {
      id: `category-${Date.now()}`,
      name: "New Category",
      percentage: 0,
      estimatedCost: 0,
      actualCost: 0,
      remaining: 0,
      priority: "medium",
      rationale: "Custom category added by user"
    };

    setBudgetData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        calculatedBudget: {
          ...prev.calculatedBudget,
          categories: [...prev.calculatedBudget.categories, newCategory]
        }
      };
    });

    toast({
      title: "Category Added",
      description: "New category has been added to your budget."
    });
  };

  const locationDisplay = budgetData?.calculatedBudget?.location?.city 
    ? `${budgetData.calculatedBudget.location.city}, ${budgetData.calculatedBudget.location.state}`
    : "Austin, Texas";

  // Add new function to check budget overage
  const checkBudgetOverage = () => {
    if (!budgetData) return null;

    const totalEstimated = budgetData.calculatedBudget.categories.reduce(
      (sum, cat) => sum + cat.estimatedCost, 
      0
    );

    if (totalEstimated > budgetData.budget) {
      const overage = totalEstimated - budgetData.budget;
      const overagePercentage = Math.round((overage / budgetData.budget) * 100);
      
      // Analyze the main cost drivers
      const costDrivers = budgetData.calculatedBudget.categories
        .map(cat => ({
          name: cat.name,
          cost: cat.estimatedCost,
          percentage: cat.percentage,
          overBudget: cat.estimatedCost - (cat.ranges?.max || cat.estimatedCost * 1.1)
        }))
        .filter(driver => driver.overBudget > 0)
        .sort((a, b) => b.overBudget - a.overBudget)
        .slice(0, 3);

      // Get cost-saving recommendations
      const recommendations = [];
      
      // Add cost drivers analysis
      if (costDrivers.length > 0) {
        recommendations.push(`The greatest contributors to this overage are: ${costDrivers.map(d => 
          `${d.name} (${formatCurrency(d.overBudget)} over typical maximum)`
        ).join(', ')}`);
      }
      
      // Check if they have expensive catering style
      const cateringCategory = budgetData.calculatedBudget.categories.find(
        cat => cat.name.toLowerCase().includes('catering')
      );
      if (cateringCategory && cateringCategory.estimatedCost > budgetData.budget * 0.3) {
        recommendations.push("Consider switching to buffet-style service to save 20-30% on catering costs");
      }

      // Check guest count impact
      if (budgetData.guestCount > 100) {
        recommendations.push(`Reducing guest count by ${Math.round(budgetData.guestCount * 0.2)} could save approximately ${formatCurrency(overage * 0.2)}`);
      }

      // Check location factor
      if (budgetData.calculatedBudget.rationale.locationFactor > 1.3) {
        recommendations.push("Consider venues in nearby areas with lower cost factors");
      }

      // Check if they have any low-priority categories with high costs
      const expensiveLowPriority = budgetData.calculatedBudget.categories
        .filter(cat => cat.priority === 'low' && cat.estimatedCost > budgetData.budget * 0.1)
        .map(cat => cat.name);
      
      if (expensiveLowPriority.length > 0) {
        recommendations.push(`Review spending in lower-priority categories: ${expensiveLowPriority.join(', ')}`);
      }

      return {
        overage,
        overagePercentage,
        recommendations,
        costDrivers
      };
    }

    return null;
  };

  // Add the warning alert before the budget overview card
  const budgetOverage = checkBudgetOverage();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!budgetData?.calculatedBudget) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl font-semibold mb-4">No Budget Data Found</h1>
        <p className="text-sage-600 mb-6">Please complete the budget questionnaire first.</p>
        <Button asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sage-100/80 via-[#E8F3E9] to-white p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-8">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-medium text-sage-900 tracking-tight bg-gradient-to-r from-[#2C3A2D] to-[#3F4F41] bg-clip-text text-transparent">Your Wedding Budget Breakdown</h1>
                <p className="mt-2 text-sm sm:text-base text-sage-600">
                  Based on your preferences and location, here's how we recommend allocating your {formatCurrency(budgetData.budget)} budget
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gradient-to-r from-sage-50 to-sage-100 hover:from-sage-100 hover:to-sage-200 text-sage-700 border-sage-200 shadow-sm">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  <span>Export to Google Sheets (CSV)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                  <Download className="h-4 w-4 mr-2" />
                  <span>Export to Excel</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Card className="mb-6 border-sage-200/50 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-white to-sage-50/30 cursor-pointer" onClick={() => setIsHowToUseExpanded(!isHowToUseExpanded)}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-sage-900 bg-gradient-to-r from-sage-800 to-sage-700 bg-clip-text text-transparent">How to Use This Breakdown</h2>
                <Button variant="ghost" size="sm">
                  {isHowToUseExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {isHowToUseExpanded && (
              <CardContent className="bg-gradient-to-br from-white to-sage-50/30 pt-4">
                <ul className="space-y-3 text-sage-700">
                  <li className="bg-white/60 p-3 rounded-lg border border-sage-200/50 shadow-sm">
                    <span className="font-medium">Quick Edit:</span> Adjust key details like guest count, date, and location to see how they affect your budget in real-time.
                  </li>
                  <li className="bg-white/60 p-3 rounded-lg border border-sage-200/50 shadow-sm">
                    <span className="font-medium">Category Management:</span> Click any category row to view and edit its details, including budget allocation and priority.
                  </li>
                  <li className="bg-white/60 p-3 rounded-lg border border-sage-200/50 shadow-sm">
                    <span className="font-medium">Actions Menu:</span> Use the ⋮ menu on each category for quick actions like viewing details or removing the category.
                  </li>
                </ul>
              </CardContent>
            )}
          </Card>
        </div>

        <div className="grid gap-6">
          {budgetOverage && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-red-800">
                      Your estimated costs exceed your budget by {formatCurrency(budgetOverage.overage)} ({budgetOverage.overagePercentage}% over)
                    </p>
                    {budgetOverage.costDrivers.length > 0 && (
                      <p className="text-red-700 mt-2">
                        <strong>Main cost drivers:</strong> {budgetOverage.costDrivers.map(d => 
                          `${d.name} (${formatCurrency(d.overBudget)} over typical maximum)`
                        ).join(', ')}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-red-700 font-medium">Recommended actions to reduce costs:</p>
                    <ul className="list-disc pl-4 space-y-1 mt-2">
                      {budgetOverage.recommendations.filter(rec => !rec.includes('greatest contributors')).map((rec, index) => (
                        <li key={index} className="text-red-700">{rec}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-red-700 mt-2">
                    Consider adjusting these elements or increasing your budget to ensure a realistic plan.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Edit Card */}
          <Card className="border-sage-200/50 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sage-50 to-sage-100/50 border-b border-sage-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#2C3A2D]">Quick Edit Key Details</CardTitle>
                  <CardDescription className="text-sage-600">
                    Adjust these key factors to see how they affect your budget
                  </CardDescription>
                </div>
                {!isEditingPreferences ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditingPreferences(true)}
                    className="bg-gradient-to-r from-sage-50 to-sage-100 hover:from-sage-100 hover:to-sage-200 text-sage-700 border-sage-200 shadow-sm"
                  >
                    Edit Details
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditingPreferences(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handlePreferenceUpdate}
                      className="bg-gradient-to-r from-sage-600 to-sage-700 text-white hover:from-sage-700 hover:to-sage-800"
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 bg-gradient-to-br from-white to-sage-50/30 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guest Count */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-sage-600" />
                    <Label>Guest Count</Label>
                  </div>
                  {isEditingPreferences ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-sage-600">Guests: {editedPreferences.guestCount}</span>
                        <span className="text-sm text-sage-600">Cost per guest: {formatCurrency(budgetData?.budget / editedPreferences.guestCount)}</span>
                      </div>
                      <Slider
                        value={[editedPreferences.guestCount]}
                        min={10}
                        max={500}
                        step={5}
                        onValueChange={(value) => setEditedPreferences(prev => ({
                          ...prev,
                          guestCount: value[0]
                        }))}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <p className="text-lg font-medium text-sage-900">{budgetData?.guestCount} guests</p>
                  )}
                  <p className="text-sm text-sage-600">Guest count significantly impacts catering, venue, and favor costs</p>
                </div>

                {/* Wedding Date */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-sage-600" />
                    <Label>Wedding Date</Label>
                  </div>
                  {isEditingPreferences ? (
                    <Input
                      type="date"
                      value={editedPreferences.weddingDate}
                      onChange={(e) => setEditedPreferences(prev => ({
                        ...prev,
                        weddingDate: e.target.value
                      }))}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-lg font-medium text-sage-900">
                      {budgetData?.calculatedBudget?.location?.weddingDate 
                        ? new Date(budgetData.calculatedBudget.location.weddingDate).toLocaleDateString()
                        : 'Not set'}
                    </p>
                  )}
                  <p className="text-sm text-sage-600">Season affects venue and vendor availability and pricing</p>
                </div>

                {/* Location */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-sage-600" />
                    <Label>Location</Label>
                  </div>
                  {isEditingPreferences ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        placeholder="City"
                        value={editedPreferences.city}
                        onChange={(e) => setEditedPreferences(prev => ({
                          ...prev,
                          city: e.target.value
                        }))}
                      />
                      <Select
                        value={editedPreferences.state}
                        onValueChange={(value) => setEditedPreferences(prev => ({
                          ...prev,
                          state: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Add state options */}
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          {/* Add more states */}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Country"
                        value={editedPreferences.country}
                        onChange={(e) => setEditedPreferences(prev => ({
                          ...prev,
                          country: e.target.value
                        }))}
                      />
                    </div>
                  ) : (
                    <p className="text-lg font-medium text-sage-900">
                      {locationDisplay}
                    </p>
                  )}
                  <p className="text-sm text-sage-600">Location impacts vendor availability and regional pricing variations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Overview & Summary */}
          <Card className="border-sage-200">
            <CardHeader className="bg-sage-50/50">
              <div className="flex items-center justify-between">
                <CardTitle>Budget Overview</CardTitle>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-sage-600">
                          <span className="text-sm">💡 Quick Tips</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="w-[300px] p-4">
                        <div className="space-y-2">
                          <p className="text-sm">• Click any category row to view and edit its details</p>
                          <p className="text-sm">• Use the ⋮ menu to quickly view details or remove a category</p>
                          <p className="text-sm">• Add new categories using the "Add Category" button</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddCategory}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-sage-50 to-white rounded-lg p-4 border border-sage-200/50 shadow-sm">
                  <p className="text-sm text-sage-600 font-normal">Total Budget</p>
                  <p className="text-lg font-medium bg-gradient-to-r from-sage-800 to-sage-700 bg-clip-text text-transparent">{formatCurrency(budgetData.budget)}</p>
                </div>
                <div className="bg-gradient-to-br from-sage-50 to-white rounded-lg p-4 border border-sage-200/50 shadow-sm">
                  <p className="text-sm text-sage-600 font-normal">Guest Count</p>
                  <p className="text-lg font-medium bg-gradient-to-r from-sage-800 to-sage-700 bg-clip-text text-transparent">{budgetData.guestCount} guests</p>
                </div>
                <div className="bg-gradient-to-br from-sage-50 to-white rounded-lg p-4 border border-sage-200/50 shadow-sm">
                  <p className="text-sm text-sage-600 font-normal">Location</p>
                  <p className="text-lg font-medium bg-gradient-to-r from-sage-800 to-sage-700 bg-clip-text text-transparent">
                    {locationDisplay} ({budgetData.calculatedBudget.rationale.locationFactor}x)
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader className="bg-sage-50/50">
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Estimated Cost</TableHead>
                    <TableHead>% of Budget</TableHead>
                    <TableHead className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-sm text-sage-600">Actions</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Click row to view details or use menu for quick actions</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.calculatedBudget.categories?.map((category) => (
                    <TableRow 
                      key={category.id}
                      className="cursor-pointer hover:bg-sage-50/30 transition-colors"
                      onClick={() => {
                        toggleCategory(category.id);
                        setExpandedCategories(prev => ({ ...prev, [category.id]: true }));
                        const element = document.getElementById(`category-details-${category.id}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                    >
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{formatCurrency(category.estimatedCost)}</TableCell>
                      <TableCell>{category.percentage}%</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              toggleCategory(category.id);
                              setExpandedCategories(prev => ({ ...prev, [category.id]: true }));
                              const element = document.getElementById(`category-details-${category.id}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updatedCategories = budgetData.calculatedBudget.categories.filter(
                                  c => c.id !== category.id
                                );
                                const updatedBudgetData = {
                                  ...budgetData,
                                  calculatedBudget: {
                                    ...budgetData.calculatedBudget,
                                    categories: updatedCategories
                                  },
                                  lastUpdated: new Date().toISOString()
                                };
                                budgetStorage.setBudgetData(updatedBudgetData);
                                setBudgetData(updatedBudgetData);
                                toast({
                                  title: "Category Removed",
                                  description: `${category.name} has been removed from your budget.`
                                });
                              }}
                            >
                              Remove Category
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-medium">
                    <TableCell>TOTAL</TableCell>
                    <TableCell>{formatCurrency(budgetData.calculatedBudget.categories.reduce((sum, cat) => sum + cat.estimatedCost, 0))}</TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Category Details */}
          {budgetData.calculatedBudget.categories?.map((category) => (
            <Card key={category.id} id={`category-details-${category.id}`}>
              <CardHeader className="cursor-pointer" onClick={() => toggleCategory(category.id)}>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-medium tracking-tight">{category.name}</CardTitle>
                  <Button variant="ghost" size="sm">
                    {expandedCategories[category.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-sage-600 font-normal">
                    {formatCurrency(category.estimatedCost)} ({category.percentage}% of budget)
                  </p>
                  <p className="text-sm text-sage-600 font-normal">
                    Priority: <span className="capitalize font-medium">{category.priority}</span>
                  </p>
                </div>
              </CardHeader>
              {expandedCategories[category.id] && (
                <CardContent className="bg-sage-50/30">
                  <div className="space-y-4">
                    {/* Budget Range with Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="bg-sage-100 rounded-lg p-3 flex-1">
                          <p className="text-sm text-sage-600 font-normal">Budget Range</p>
                          <p className="font-medium text-sage-900">
                            {category.ranges ? (
                              `${formatCurrency(category.ranges.min)} - ${formatCurrency(category.ranges.max)}`
                            ) : (
                              `${formatCurrency(category.estimatedCost * 0.9)} - ${formatCurrency(category.estimatedCost * 1.1)}`
                            )}
                          </p>
                          <p className="text-sm text-sage-600 mt-1">
                            Typically {Math.max(0, category.percentage - 5)}% - {Math.min(100, category.percentage + 5)}% of total budget
                          </p>
                          {category.actualCost > 0 && (
                            <p className="text-sm text-sage-600 mt-1">Spent so far: {formatCurrency(category.actualCost)}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Category Description */}
                    {category.description && (
                      <div className="bg-white rounded-lg p-4 border border-sage-200">
                        <h4 className="text-sm font-medium mb-2">What's Included</h4>
                        <p className="text-sm text-sage-900 font-normal leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    )}

                    {/* Category Management */}
                    <div className="bg-white rounded-lg p-4 border border-sage-200">
                      <h4 className="text-sm font-medium mb-4">Category Management</h4>
                      <div className="space-y-4">
                        {/* Budget Allocation */}
                        <div>
                          <Label className="text-sm text-sage-700">Budget Allocation</Label>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="relative">
                              <Input
                                type="number"
                                value={category.estimatedCost}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value) || 0;
                                  handleCategoryUpdate(category.id, newValue);
                                }}
                                className={cn(
                                  "w-32",
                                  validationErrors.amount && "border-red-500",
                                  impactedCategories.length > 0 && "border-yellow-500"
                                )}
                              />
                              {validationErrors.amount && (
                                <p className="text-xs text-red-500 mt-1">{validationErrors.amount}</p>
                              )}
                            </div>
                            <span className="text-sm text-sage-600">
                              ({Math.round((category.estimatedCost / budgetData.budget) * 100)}% of total budget)
                            </span>
                          </div>
                          {impactedCategories.includes(category.id) && (
                            <p className="text-xs text-yellow-600 mt-1">
                              This category will be significantly impacted by recent changes
                            </p>
                          )}
                        </div>

                        {/* Priority Level */}
                        <div>
                          <Label className="text-sm text-sage-700">Priority Level</Label>
                          <Select
                            value={category.priority}
                            onValueChange={(value: 'high' | 'medium' | 'low') => {
                              const updatedCategory = {
                                ...category,
                                priority: value
                              };
                              setBudgetData({
                                ...budgetData,
                                calculatedBudget: {
                                  ...budgetData.calculatedBudget,
                                  categories: budgetData.calculatedBudget.categories.map(c =>
                                    c.id === category.id ? updatedCategory : c
                                  )
                                }
                              });
                            }}
                          >
                            <SelectTrigger className="w-32 mt-2">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Actual Spent */}
                        <div>
                          <Label className="text-sm text-sage-700">Amount Spent So Far</Label>
                          <div className="flex items-center gap-4 mt-2">
                            <Input
                              type="number"
                              value={category.actualCost}
                              onChange={(e) => {
                                const newValue = parseInt(e.target.value) || 0;
                                const updatedCategory = {
                                  ...category,
                                  actualCost: newValue,
                                  remaining: category.estimatedCost - newValue
                                };
                                setBudgetData({
                                  ...budgetData,
                                  calculatedBudget: {
                                    ...budgetData.calculatedBudget,
                                    categories: budgetData.calculatedBudget.categories.map(c =>
                                      c.id === category.id ? updatedCategory : c
                                    )
                                  }
                                });
                              }}
                              className="w-32"
                            />
                            <span className="text-sm text-sage-600">
                              (Remaining: {formatCurrency(category.remaining)})
                            </span>
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <Label className="text-sm text-sage-700">Notes</Label>
                          <Input
                            value={category.notes || ''}
                            onChange={(e) => {
                              const updatedCategory = {
                                ...category,
                                notes: e.target.value
                              };
                              setBudgetData({
                                ...budgetData,
                                calculatedBudget: {
                                  ...budgetData.calculatedBudget,
                                  categories: budgetData.calculatedBudget.categories.map(c =>
                                    c.id === category.id ? updatedCategory : c
                                  )
                                }
                              });
                            }}
                            className="mt-2"
                            placeholder="Add notes about this category..."
                          />
                        </div>

                        {/* Save Changes Button */}
                        <Button
                          onClick={() => {
                            const updatedBudgetData = {
                              ...budgetData,
                              lastUpdated: new Date().toISOString()
                            };
                            budgetStorage.setBudgetData(updatedBudgetData);
                            toast({
                              title: "Changes Saved",
                              description: `Updates to ${category.name} have been saved.`
                            });
                          }}
                          className="w-full bg-gradient-to-r from-sage-600 to-sage-700 text-white hover:from-sage-700 hover:to-sage-800"
                        >
                          Save Changes
                        </Button>

                        {/* Remove Category */}
                        <Button
                          variant="outline"
                          onClick={() => {
                            const updatedCategories = budgetData.calculatedBudget.categories.filter(
                              c => c.id !== category.id
                            );
                            const updatedBudgetData = {
                              ...budgetData,
                              calculatedBudget: {
                                ...budgetData.calculatedBudget,
                                categories: updatedCategories
                              },
                              lastUpdated: new Date().toISOString()
                            };
                            budgetStorage.setBudgetData(updatedBudgetData);
                            setBudgetData(updatedBudgetData);
                            toast({
                              title: "Category Removed",
                              description: `${category.name} has been removed from your budget.`
                            });
                          }}
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove Category
                        </Button>
                      </div>
                    </div>

                    {/* Money Saving Tips */}
                    {category.budgetingTips && category.budgetingTips.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-sage-200">
                        <h4 className="text-sm font-medium mb-2">Money Saving Tips</h4>
                        <ul className="space-y-2">
                          {category.budgetingTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-sage-900">
                              <span className="text-sage-500 mt-1">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Unified Explanation */}
                    <div className="bg-white rounded-lg p-4 border border-sage-200">
                      <p className="text-sm text-sage-900 font-normal leading-relaxed">
                        {budgetData.calculatedBudget.rationale?.notes?.filter(note => 
                          note.toLowerCase().includes(category.name.toLowerCase())
                        ).map((note, index) => (
                          <span key={index}>
                            {note}
                            <br />
                          </span>
                        ))}
                        {budgetData.calculatedBudget.rationale?.locationFactor !== 1 && budgetData.calculatedBudget.location?.city && (
                          <span className="text-sage-700">
                            {" "}Due to your location in {budgetData.calculatedBudget.location.city}, expect costs to be 
                            {budgetData.calculatedBudget.rationale.locationFactor > 1 ? " higher" : " lower"} 
                            ({Math.abs((budgetData.calculatedBudget.rationale.locationFactor * 100 - 100)).toFixed(0)}% {budgetData.calculatedBudget.rationale.locationFactor > 1 ? "above" : "below"} average).
                          </span>
                        )}
                        {budgetData.calculatedBudget.rationale?.seasonalFactor !== 1 && (
                          <span className="text-sage-700">
                            {" "}Your {budgetData.calculatedBudget.rationale.seasonalFactor > 1 ? "peak" : "off-peak"} season date adds a 
                            {budgetData.calculatedBudget.rationale.seasonalFactor > 1 ? " premium" : " discount"} of 
                            {Math.abs((budgetData.calculatedBudget.rationale.seasonalFactor * 100 - 100)).toFixed(0)}%.
                          </span>
                        )}
                        {category.priority === 'high' && (
                          <span className="text-sage-700"> We've prioritized this category based on your preferences.</span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {message && (
        <div className="mb-4">
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
} 