"use client"

import React, { useEffect, useState } from 'react';
import { storage } from "@/lib/storage";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, FileSpreadsheet, Download, Calendar, Users, MapPin, Plus, MoreVertical, LayoutGrid } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

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
    weddingDate: string;
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
      weddingDate: string;
    };
  };
  weddingDate: string;
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
    isDestination: false,
    budget: 0
  });
  const [impactedCategories, setImpactedCategories] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isHowToUseExpanded, setIsHowToUseExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'spreadsheet'>('card');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editedAmount, setEditedAmount] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    try {
      const userData = storage.getUserData();
      if (userData?.calculatedBudget) {
        // Transform UserData into BudgetData with proper type checking
        const transformedData: BudgetData = {
          totalBudget: userData.budget || 0,
          budget: userData.budget || 0,
          location: {
            city: userData.calculatedBudget.location?.city || "",
            state: userData.calculatedBudget.location?.state || "",
            country: userData.calculatedBudget.location?.country || "United States",
            isDestination: userData.calculatedBudget.location?.isDestination || false,
            weddingDate: userData.weddingDate
          },
          guestCount: userData.guestCount || 0,
          priorities: [],
          categories: userData.calculatedBudget.categories || [],
          lastUpdated: new Date().toISOString(),
          rationale: {
            totalBudget: (userData.budget || 0).toString(),
            locationFactor: userData.calculatedBudget.rationale?.locationFactor || 1,
            seasonalFactor: userData.calculatedBudget.rationale?.seasonalFactor || 1,
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
            location: userData.calculatedBudget.location || {
              city: userData.calculatedBudget.location?.city || "",
              state: userData.calculatedBudget.location?.state || "",
              country: userData.calculatedBudget.location?.country || "United States",
              isDestination: userData.calculatedBudget.location?.isDestination || false,
              weddingDate: userData.weddingDate
            }
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
        isDestination: budgetData.calculatedBudget.location?.isDestination || false,
        budget: budgetData.budget
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
      // Validate required fields
      const errors: Record<string, string> = {};
      if (!editedPreferences.city.trim()) {
        errors.city = 'City is required';
      }
      if (!editedPreferences.isDestination && !editedPreferences.state.trim()) {
        errors.state = 'State is required for non-destination weddings';
      }
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      setIsUpdating(true);
      setValidationErrors({});

      const locationData = {
        city: editedPreferences.city.trim(),
        state: editedPreferences.state.trim(),
        country: editedPreferences.country || 'United States',
        isDestination: editedPreferences.isDestination,
        weddingDate: editedPreferences.weddingDate,
      };

      const userData = {
        guestCount: editedPreferences.guestCount,
        budget: editedPreferences.budget,
      };

      const response = await fetch('/api/budget/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: locationData,
          ...userData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const updatedData = await response.json();
      setBudgetData(updatedData);
      setIsEditingPreferences(false); // Close the edit mode after successful update

      // Calculate percentage change in total budget
      const oldTotal = budgetData?.calculatedBudget?.categories.reduce((sum: number, cat: BudgetCategory) => sum + cat.estimatedCost, 0) || 0;
      const newTotal = updatedData.calculatedBudget?.categories.reduce((sum: number, cat: BudgetCategory) => sum + cat.estimatedCost, 0) || 0;
      const percentageChange = ((newTotal - oldTotal) / oldTotal) * 100;

      // Generate explanation for changes
      let explanation = '';
      if (editedPreferences.guestCount !== budgetData?.guestCount) {
        explanation += `Guest count changed from ${budgetData?.guestCount} to ${editedPreferences.guestCount}. `;
      }
      if (editedPreferences.budget !== budgetData?.budget) {
        explanation += `Budget changed from $${budgetData?.budget.toLocaleString()} to $${editedPreferences.budget.toLocaleString()}. `;
      }
      if (editedPreferences.weddingDate !== budgetData?.calculatedBudget.location?.weddingDate) {
        explanation += 'Wedding date updated. ';
      }
      if (editedPreferences.city !== budgetData?.calculatedBudget.location?.city ||
          editedPreferences.state !== budgetData?.calculatedBudget.location?.state) {
        explanation += 'Location updated. ';
      }

      toast({
        title: 'Changes saved successfully',
        description: `${explanation}Estimated costs ${percentageChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(percentageChange).toFixed(1)}%.`,
        variant: 'default',
      });

    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error saving changes',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
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

  const locationDisplay = budgetData?.location?.city && budgetData?.location?.state
    ? `${budgetData.location.city}, ${budgetData.location.state}`
    : budgetData?.location?.city || "Location not set";

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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sage-100/80 via-[#E8F3E9] to-white p-4 sm:p-8">
      <div className={cn(
        "mx-auto",
        viewMode === 'spreadsheet' ? 'max-w-7xl' : 'max-w-4xl'
      )}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-8">
              <Button variant="ghost" size="icon" asChild>
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
              <div>
                <h1 className="text-xl sm:text-2xl font-medium text-sage-900 tracking-tight bg-gradient-to-r from-[#2C3A2D] to-[#3F4F41] bg-clip-text text-transparent">Your Wedding Budget Breakdown</h1>
                <p className="mt-2 text-sm sm:text-base text-sage-600">
                  Based on your preferences and location, here's how we recommend allocating your {formatCurrency(budgetData.budget)} budget
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'card' ? 'spreadsheet' : 'card')}
                className="bg-gradient-to-r from-sage-50 to-sage-100 hover:from-sage-100 hover:to-sage-200 text-sage-700 border-sage-200 shadow-sm"
              >
                {viewMode === 'card' ? (
                  <>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Spreadsheet View
                  </>
                ) : (
                  <>
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Card View
                  </>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-gradient-to-r from-sage-50 to-sage-100 hover:from-sage-100 hover:to-sage-200 text-sage-700 border-sage-200 shadow-sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportToCSV}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    <span>Export to Google Sheets (CSV)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToExcel}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    <span>Export to Excel</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 border-red-200 shadow-sm"
                  >
                    Start Over
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start Over?</DialogTitle>
                    <DialogDescription>
                      This will clear all your budget data and preferences. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        storage.clearUserData();
                        window.location.href = '/dashboard/budget';
                      }}
                    >
                      Yes, Start Over
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
                          <p className="text-sm">• Click any overview card to edit budget, guest count, or location</p>
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
                {/* Total Budget Card */}
                <div 
                  className="bg-gradient-to-br from-sage-50 to-white rounded-lg p-4 border border-sage-200/50 shadow-sm cursor-pointer"
                  onClick={() => !isEditingPreferences && setIsEditingPreferences(true)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-sage-600 font-normal">Total Budget</p>
                  </div>
                  {isEditingPreferences ? (
                    <div>
                      <Input
                        type="number"
                        value={editedPreferences.budget || budgetData.budget}
                        onChange={(e) => setEditedPreferences(prev => ({
                          ...prev,
                          budget: Number(e.target.value)
                        }))}
                        className="w-full"
                        placeholder="Enter budget amount"
                      />
                    </div>
                  ) : (
                    <p className="text-lg font-medium bg-gradient-to-r from-sage-800 to-sage-700 bg-clip-text text-transparent">
                      {formatCurrency(budgetData.budget)}
                    </p>
                  )}
                </div>

                {/* Guest Count Card */}
                <div 
                  className="bg-gradient-to-br from-sage-50 to-white rounded-lg p-4 border border-sage-200/50 shadow-sm cursor-pointer"
                  onClick={() => !isEditingPreferences && setIsEditingPreferences(true)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-sage-600" />
                      <p className="text-sm text-sage-600 font-normal">Guest Count & Date</p>
                    </div>
                  </div>
                  {isEditingPreferences ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm text-sage-600">Guests: {editedPreferences.guestCount}</span>
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
                      <div>
                        <Label className="text-sm text-sage-600">Wedding Date</Label>
                        <Input
                          type="date"
                          value={editedPreferences.weddingDate}
                          onChange={(e) => setEditedPreferences(prev => ({
                            ...prev,
                            weddingDate: e.target.value
                          }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium bg-gradient-to-r from-sage-800 to-sage-700 bg-clip-text text-transparent">
                        {budgetData.guestCount} guests
                      </p>
                      <p className="text-sm text-sage-600 mt-1">
                        {budgetData.location.weddingDate ? 
                          new Date(budgetData.location.weddingDate).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })
                          : 'Date not set'
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* Location Card */}
                <div 
                  className="bg-gradient-to-br from-sage-50 to-white rounded-lg p-4 border border-sage-200/50 shadow-sm cursor-pointer"
                  onClick={() => !isEditingPreferences && setIsEditingPreferences(true)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-sage-600" />
                      <p className="text-sm text-sage-600 font-normal">Location</p>
                    </div>
                  </div>
                  {isEditingPreferences ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Input
                            placeholder="City"
                            value={editedPreferences.city}
                            onChange={(e) => {
                              setEditedPreferences(prev => ({
                                ...prev,
                                city: e.target.value
                              }));
                              // Clear error when user starts typing
                              if (validationErrors.city) {
                                setValidationErrors(prev => ({
                                  ...prev,
                                  city: ''
                                }));
                              }
                            }}
                            className={cn(
                              "h-8",
                              validationErrors.city && "border-red-500 focus-visible:ring-red-500"
                            )}
                          />
                          {validationErrors.city && (
                            <p className="text-xs text-red-500">{validationErrors.city}</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Select
                            value={editedPreferences.state}
                            onValueChange={(value) => {
                              setEditedPreferences(prev => ({
                                ...prev,
                                state: value
                              }));
                              // Clear error when user selects a state
                              if (validationErrors.state) {
                                setValidationErrors(prev => ({
                                  ...prev,
                                  state: ''
                                }));
                              }
                            }}
                          >
                            <SelectTrigger className={cn(
                              "h-8",
                              validationErrors.state && "border-red-500 focus-visible:ring-red-500"
                            )}>
                              <SelectValue placeholder="State" />
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
                          {validationErrors.state && (
                            <p className="text-xs text-red-500">{validationErrors.state}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Checkbox
                          id="destination"
                          checked={editedPreferences.isDestination}
                          onCheckedChange={(checked) => {
                            setEditedPreferences(prev => ({
                              ...prev,
                              isDestination: checked as boolean
                            }));
                            // Clear state error if it's a destination wedding
                            if (checked && validationErrors.state) {
                              setValidationErrors(prev => ({
                                ...prev,
                                state: ''
                              }));
                            }
                          }}
                        />
                        <label
                          htmlFor="destination"
                          className="text-xs text-sage-600 cursor-pointer"
                        >
                          This is a destination wedding
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium bg-gradient-to-r from-sage-800 to-sage-700 bg-clip-text text-transparent">
                        {budgetData.location.city}
                        {budgetData.location.state && `, ${budgetData.location.state}`}
                      </p>
                      {budgetData.location.isDestination && (
                        <p className="text-sm text-sage-600 mt-1">Destination Wedding</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isEditingPreferences && (
                <div className="flex justify-end gap-2 mb-6">
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

              {viewMode === 'spreadsheet' ? (
                <div className="overflow-x-auto -mx-6">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-sage-200 rounded-lg bg-white">
                      <Table>
                        <TableHeader className="bg-sage-50/50">
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Estimated Cost</TableHead>
                            <TableHead>Actual Cost</TableHead>
                            <TableHead>Remaining</TableHead>
                            <TableHead>% of Budget</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Min Range</TableHead>
                            <TableHead>Max Range</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {budgetData.calculatedBudget.categories?.map((category) => (
                            <TableRow key={category.id}>
                              <TableCell>{category.name}</TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={category.estimatedCost}
                                  onChange={(e) => handleCategoryUpdate(category.id, parseInt(e.target.value) || 0)}
                                  className="w-24 h-8"
                                />
                              </TableCell>
                              <TableCell>
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
                                  className="w-24 h-8"
                                />
                              </TableCell>
                              <TableCell>{formatCurrency(category.remaining)}</TableCell>
                              <TableCell>{category.percentage}%</TableCell>
                              <TableCell>
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
                                  <SelectTrigger className="w-24 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>{formatCurrency(category.ranges?.min || category.estimatedCost * 0.9)}</TableCell>
                              <TableCell>{formatCurrency(category.ranges?.max || category.estimatedCost * 1.1)}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => {
                                      toggleCategory(category.id);
                                      setViewMode('card');
                                      setExpandedCategories(prev => ({ ...prev, [category.id]: true }));
                                      setTimeout(() => {
                                        const element = document.getElementById(`category-details-${category.id}`);
                                        if (element) {
                                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                      }, 100);
                                    }}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => {
                                        const updatedCategories = budgetData.calculatedBudget.categories.filter(
                                          c => c.id !== category.id
                                        );
                                        setBudgetData({
                                          ...budgetData,
                                          calculatedBudget: {
                                            ...budgetData.calculatedBudget,
                                            categories: updatedCategories
                                          }
                                        });
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
                            <TableCell>{formatCurrency(budgetData.calculatedBudget.categories.reduce((sum, cat) => sum + cat.actualCost, 0))}</TableCell>
                            <TableCell>{formatCurrency(budgetData.calculatedBudget.categories.reduce((sum, cat) => sum + cat.remaining, 0))}</TableCell>
                            <TableCell>100%</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              ) : (
                <>
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
                                <p className="text-xs">Click amount to edit or use menu for other actions</p>
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
                          className="hover:bg-sage-50/30 transition-colors"
                        >
                          <TableCell>{category.name}</TableCell>
                          <TableCell 
                            className="cursor-pointer"
                            onClick={() => {
                              setEditingCategoryId(category.id);
                              setEditedAmount(category.estimatedCost);
                            }}
                          >
                            {editingCategoryId === category.id ? (
                              <form 
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (editedAmount !== null) {
                                    handleCategoryUpdate(category.id, editedAmount);
                                    setEditingCategoryId(null);
                                    setEditedAmount(null);
                                  }
                                }}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  type="number"
                                  value={editedAmount || ''}
                                  onChange={(e) => setEditedAmount(Number(e.target.value))}
                                  className="w-24 h-8"
                                  autoFocus
                                  onBlur={() => {
                                    if (editedAmount !== null) {
                                      handleCategoryUpdate(category.id, editedAmount);
                                      setEditingCategoryId(null);
                                      setEditedAmount(null);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                      setEditingCategoryId(null);
                                      setEditedAmount(null);
                                    }
                                  }}
                                />
                              </form>
                            ) : (
                              formatCurrency(category.estimatedCost)
                            )}
                          </TableCell>
                          <TableCell>{category.percentage}%</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
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
                </>
              )}
            </CardContent>
          </Card>

          {/* Category Details */}
          {viewMode === 'card' && budgetData.calculatedBudget.categories?.map((category) => (
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
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}