"use client"

import React, { useEffect, useState } from 'react';
import { storage } from "@/lib/storage";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, FileSpreadsheet, Download, Calendar, Users, MapPin, Plus, MoreVertical, LayoutGrid, X, AlertTriangle, Pencil } from "lucide-react";
import Link from "next/link";
import type { BudgetCategory, BudgetData, UserData, BudgetPreferences, CalculatedBudget } from "@/types/budget";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  impactedCategories: string[];
}

// Add this helper function before the BudgetBreakdownPage component
const defaultTipsForCategory = (categoryName: string) => {
  const tips: Record<string, { tips: string[], ranges: { min: number, max: number } }> = {
    "Entertainment": {
      tips: [
        "Consider a DJ for the ceremony and playlist for cocktail hour",
        "Book during off-peak season for better rates",
        "Negotiate package deals including lighting and MC services",
        "Check if vendors offer early booking discounts"
      ],
      ranges: { min: 1800, max: 4000 }
    },
    "Venue": {
      tips: [
        "Compare off-peak and peak season rates",
        "Ask about package deals with preferred vendors",
        "Consider all-inclusive venues to save on rentals",
        "Book well in advance for better rates"
      ],
      ranges: { min: 3000, max: 15000 }
    },
    // Add more categories as needed...
  }
  
  return tips[categoryName] || {
    tips: ["Research multiple vendors for best rates", "Book early for better deals", "Ask about package discounts"],
    ranges: { min: 1000, max: 3000 }
  }
}

export default function BudgetBreakdownPage() {
  const [budgetData, setBudgetData] = useState<BudgetData>({
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
  });
  const [undoHistory, setUndoHistory] = useState<BudgetData[]>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<BudgetCategory | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
  const [viewMode, setViewMode] = useState<'card' | 'spreadsheet'>('card');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editedAmount, setEditedAmount] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true)
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(true)
  const [isExportExpanded, setIsExportExpanded] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

  useEffect(() => {
    try {
      const userData = storage.getUserData() as UserData;
      if (userData) {
        const transformedData: BudgetData = {
          budget: userData.budget || 0,
          totalBudget: userData.totalBudget || userData.budget || 0,
          guestCount: userData.guestCount || 0,
          location: userData.calculatedBudget?.location || userData.location || {
            city: "",
            state: "",
            country: "United States",
            isDestination: false,
            weddingDate: new Date().toISOString().split('T')[0]
          },
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
            location: userData.calculatedBudget?.location || userData.location || {
              city: "",
              state: "",
              country: "United States",
              isDestination: false,
              weddingDate: userData.weddingDate
            }
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
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
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
    const currentData: Partial<UserData> = {
      budget: editedPreferences.budget,
      guestCount: editedPreferences.guestCount,
      location: {
        city: editedPreferences.city,
        state: editedPreferences.state,
        country: editedPreferences.country,
        isDestination: editedPreferences.isDestination,
        weddingDate: editedPreferences.weddingDate
      },
      preferences: budgetData.preferences,
      lastUpdated: new Date().toISOString()
    };
    storage.setUserData(currentData);
    
    // Update local state
    setBudgetData(prev => ({
      ...prev,
      budget: editedPreferences.budget,
      guestCount: editedPreferences.guestCount,
      location: {
        city: editedPreferences.city,
        state: editedPreferences.state,
        country: editedPreferences.country,
        isDestination: editedPreferences.isDestination,
        weddingDate: editedPreferences.weddingDate
      },
      calculatedBudget: {
        ...prev.calculatedBudget,
        location: {
          city: editedPreferences.city,
          state: editedPreferences.state,
          country: editedPreferences.country,
          isDestination: editedPreferences.isDestination,
          weddingDate: editedPreferences.weddingDate
        }
      },
      lastUpdated: new Date().toISOString()
    }));
    
    setIsEditingPreferences(false);
    
    toast({
      title: "Preferences Updated",
      description: "Your preferences have been saved successfully."
    });
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

  const handleCategoryUpdate = async (categoryId: string, newAmount: number, updates?: { notes?: string }) => {
    try {
      const validation = validateBudgetChange(categoryId, newAmount);
      setValidationErrors(validation.errors);

      if (!validation.isValid) {
        toast({
          variant: "default",
          title: "Warning",
          description: Object.values(validation.errors)[0]
        });
      }

      // Save current state to undo history
      setUndoHistory(prev => [...prev, budgetData]);

      const currentData = await budgetStorage.getBudgetData();
      if (!currentData) return;

      const updatedCategories = currentData.calculatedBudget.categories.map((c: BudgetCategory) =>
        c.id === categoryId
          ? { 
              ...c, 
              estimatedCost: newAmount, 
              remaining: newAmount - c.actualCost,
              ...(updates || {})
            }
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
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setBudgetData(budgetData);
              setUndoHistory(prev => [...prev, updatedBudgetData]);
              budgetStorage.setBudgetData(budgetData);
            }}
          >
            Undo
          </Button>
        )
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

  // Add the QuickTips component at the top level
  const QuickTips = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" className="ml-2">
            💡 Quick Tips
          </Button>
        </TooltipTrigger>
        <TooltipContent className="w-80">
          <div className="space-y-2">
            <p className="font-medium">Budget Management Tips:</p>
            <ul className="text-sm list-disc pl-4 space-y-1">
              <li>Click on any amount to edit it directly</li>
              <li>Expand categories to see detailed breakdowns and saving tips</li>
              <li>Use the priority levels to help make trade-off decisions</li>
              <li>Monitor the budget overview to stay within your total budget</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // Add the AddCategory button and dialog in the main component
  const addCategoryButton = (
    <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-gradient-to-r from-sage-50 to-sage-100 hover:from-sage-100 hover:to-sage-200 text-sage-700 border-sage-200 shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Budget Category</DialogTitle>
          <DialogDescription>
            Create a new category to track additional expenses
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" placeholder="e.g., Transportation" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Initial Budget</Label>
            <Input id="amount" type="number" placeholder="Enter amount" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowAddCategory(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCategory}>Add Category</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Add new function to handle undo
  const handleUndo = () => {
    if (undoHistory.length > 0) {
      const previousState = undoHistory[undoHistory.length - 1];
      const newHistory = undoHistory.slice(0, -1);
      
      setBudgetData(previousState);
      setUndoHistory(newHistory);
      
      // Save to storage
      budgetStorage.setBudgetData(previousState);
      
      toast({
        title: "Change undone",
        description: "Your last change has been reversed",
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setBudgetData(budgetData);
              setUndoHistory([...newHistory, previousState]);
              budgetStorage.setBudgetData(budgetData);
            }}
          >
            Redo
          </Button>
        )
      });
    }
  };

  // Add function to handle category deletion
  const handleDeleteCategory = (category: BudgetCategory) => {
    setCategoryToDelete(category);
    setShowDeleteDialog(true);
  };

  // Add function to confirm category deletion
  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    // Save current state to undo history
    setUndoHistory(prev => [...prev, budgetData]);

    const updatedCategories = budgetData.calculatedBudget.categories.filter(
      c => c.id !== categoryToDelete.id
    );
    const updatedBudgetData = {
      ...budgetData,
      calculatedBudget: {
        ...budgetData.calculatedBudget,
        categories: updatedCategories
      },
      lastUpdated: new Date().toISOString()
    };

    await budgetStorage.setBudgetData(updatedBudgetData);
    setBudgetData(updatedBudgetData);
    setShowDeleteDialog(false);
    setCategoryToDelete(null);

    toast({
      title: "Category Removed",
      description: `${categoryToDelete.name} has been removed from your budget.`,
      action: (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleUndo}
        >
          Undo
        </Button>
      )
    });
  };

  const formatCategoryName = (name: string) => {
    if (name === "Hair_makeup") return "Hair and Make-up";
    return name;
  };

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
      {/* Update the delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl text-sage-900">Delete {categoryToDelete?.name}?</DialogTitle>
            <DialogDescription className="text-sage-600">
              Are you sure you want to delete this category? This will permanently remove it from your budget breakdown. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="bg-white hover:bg-sage-50"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDeleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className={cn(
        "mx-auto",
        viewMode === 'spreadsheet' ? 'max-w-7xl' : 'max-w-4xl'
      )}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-8">
              <Button variant="ghost" size="icon" asChild onClick={() => {
                // Save current state before navigating
                const currentData = {
                  budget: budgetData?.totalBudget,
                  guestCount: budgetData?.guestCount,
                  city: budgetData?.location?.city,
                  state: budgetData?.location?.state,
                  isDestination: budgetData?.location?.country !== 'United States',
                  weddingDate: budgetData?.calculatedBudget?.location?.weddingDate,
                  preferences: budgetData?.preferences
                };
                storage.setUserData(currentData);
              }}>
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
              {undoHistory.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUndo}
                  className="bg-gradient-to-r from-sage-50 to-sage-100 hover:from-sage-100 hover:to-sage-200 text-sage-700 border-sage-200 shadow-sm"
                >
                  Undo Last Change
                </Button>
              )}
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
            <CardHeader className="bg-gradient-to-br from-white to-sage-50/30">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-sage-900 bg-gradient-to-r from-sage-800 to-sage-700 bg-clip-text text-transparent">Budget Overview</h2>
                <div className="flex items-center gap-2">
                  <QuickTips />
                  {addCategoryButton}
                </div>
              </div>
            </CardHeader>

            {/* Budget Overage Alert - Enhanced with red styling */}
            {budgetOverage && (
              <Alert className="mx-6 mb-6 mt-4 bg-red-50 border-red-200 text-red-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <AlertDescription>
                    <p className="font-medium text-red-800">Budget Alert: {formatCurrency(budgetOverage.overage)} over budget ({budgetOverage.overagePercentage}%)</p>
                    <div className="mt-2 space-y-2">
                      {budgetOverage.recommendations.map((tip: string, index: number) => (
                        <p key={index} className="text-sm text-red-700">{tip}</p>
                      ))}
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            )}

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
                          step={1}
                          onValueChange={([value]) => setEditedPreferences(prev => ({
                            ...prev,
                            guestCount: value
                          }))}
                          className="mt-2"
                        />
                      </div>
                      <Input
                        type="date"
                        value={editedPreferences.weddingDate}
                        onChange={(e) => setEditedPreferences(prev => ({
                          ...prev,
                          weddingDate: e.target.value
                        }))}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-lg font-medium bg-gradient-to-r from-sage-800 to-sage-700 bg-clip-text text-transparent">
                        {budgetData.guestCount} guests
                      </p>
                      <p className="text-sm text-sage-600">
                        {budgetData.location?.weddingDate ? new Date(budgetData.location.weddingDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Date not set'}
                      </p>
                    </>
                  )}
                </div>

                {/* Location Card */}
                <div 
                  className="bg-gradient-to-br from-sage-50 to-white rounded-lg p-4 border border-sage-200/50 shadow-sm cursor-pointer hover:border-sage-300 hover:shadow-md transition-all group relative"
                  onClick={() => !isEditingPreferences && setIsEditingPreferences(true)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-sage-600" />
                      <p className="text-sm text-sage-600 font-normal">Location</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingPreferences(true);
                      }}
                    >
                      <Pencil className="h-4 w-4 text-sage-600" />
                    </Button>
                  </div>
                  {isEditingPreferences ? (
                    <div className="space-y-2">
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
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isDestination"
                          checked={editedPreferences.isDestination}
                          onCheckedChange={(checked) => setEditedPreferences(prev => ({
                            ...prev,
                            isDestination: checked as boolean
                          }))}
                        />
                        <label htmlFor="isDestination" className="text-sm text-sage-600">
                          Destination Wedding
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium bg-gradient-to-r from-sage-800 to-sage-700 bg-clip-text text-transparent">
                        {locationDisplay}
                      </p>
                      {budgetData.location?.isDestination && (
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
                          {budgetData.calculatedBudget.categories?.map((category) => {
                            const isExpanded = Boolean(expandedCategories[category.id]);
                            const hasOverage = category.actualCost > category.estimatedCost;
                            
                            return (
                              <TableRow key={category.id}>
                                <TableCell>
                                  <Button
                                    variant="link"
                                    className="p-0 h-auto font-normal hover:text-sage-700"
                                    onClick={() => {
                                      toggleCategory(category.id);
                                      setExpandedCategories(prev => ({ ...prev, [category.id]: true }));
                                      const element = document.getElementById(`category-details-${category.id}`);
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                      }
                                    }}
                                  >
                                    {formatCategoryName(category.name)}
                                  </Button>
                                </TableCell>
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
                                        setExpandedCategories(prev => ({ ...prev, [category.id]: true }));
                                        const element = document.getElementById(`category-details-${category.id}`);
                                        if (element) {
                                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                      }}>
                                        View Details
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })}
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
                      {budgetData.calculatedBudget.categories?.map((category) => {
                        const isExpanded = Boolean(expandedCategories[category.id]);
                        const hasOverage = category.actualCost > category.estimatedCost;
                        
                        return (
                          <TableRow 
                            key={category.id}
                            className="hover:bg-sage-50/30 transition-colors"
                          >
                            <TableCell>
                              <Button
                                variant="link"
                                className="p-0 h-auto font-normal hover:text-sage-700"
                                onClick={() => {
                                  toggleCategory(category.id);
                                  setExpandedCategories(prev => ({ ...prev, [category.id]: true }));
                                  const element = document.getElementById(`category-details-${category.id}`);
                                  if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }
                                }}
                              >
                                {formatCategoryName(category.name)}
                              </Button>
                            </TableCell>
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
                                    value={editingCategoryId === category.id ? (editedAmount || 0) : category.estimatedCost}
                                    onChange={(e) => {
                                      setEditingCategoryId(category.id);
                                      setEditedAmount(Number(e.target.value));
                                    }}
                                    onBlur={() => {
                                      if (editedAmount !== null) {
                                        handleCategoryUpdate(category.id, editedAmount);
                                      }
                                    }}
                                    className="w-32"
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
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
          {viewMode === 'card' && (
            <div className="space-y-6">
              {budgetData.calculatedBudget.categories?.map((category) => {
                const isExpanded = Boolean(expandedCategories[category.id]);
                const hasOverage = category.actualCost > category.estimatedCost;
                
                return (
                  <Card 
                    key={category.id} 
                    className="relative cursor-pointer" 
                    id={`category-details-${category.id}`}
                  >
                    <section onClick={() => toggleCategory(category.id)}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                              {formatCategoryName(category.name)}
                              {hasOverage && (
                                <div className="inline-flex items-center">
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                </div>
                              )}
                            </CardTitle>
                            <div className="text-sm text-sage-600">
                              {formatCurrency(category.estimatedCost)} allocated
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(category.id);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CardHeader>

                      <CardContent>
                        {hasOverage && (
                          <Alert variant="destructive" className="mb-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Budget Overage</AlertTitle>
                            <AlertDescription>
                              You're over budget by {formatCurrency(category.actualCost - category.estimatedCost)}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-4">
                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="space-y-4 pt-4" onClick={(e) => e.stopPropagation()}>
                              {/* Combined Cost Breakdown & Tips */}
                              <div className="bg-sage-50 rounded-lg p-4 space-y-3">
                                <h4 className="font-medium text-sage-900">Cost Breakdown & Tips</h4>
                                
                                <div className="space-y-2 text-sm text-sage-700">
                                  {/* Catering Details */}
                                  {category.name === "Catering" && (
                                    <>
                                      <p>• Cost Structure: 80% variable with guest count (food, service), 20% fixed costs (setup, equipment)</p>
                                      {budgetData.preferences?.cateringStyle && (
                                        <p>• Your Choice: {budgetData.preferences.cateringStyle} service (
                                          {budgetData.preferences.cateringStyle === "Plated" ? "30% more than buffet" :
                                           budgetData.preferences.cateringStyle === "Family Style" ? "20% more than buffet" : "standard buffet pricing"}
                                          )</p>
                                      )}
                                      {budgetData.preferences?.barService && (
                                        <p>• Bar Service: {budgetData.preferences.barService} (
                                          {budgetData.preferences.barService === "Full Open Bar" ? "30% more than beer & wine" :
                                           budgetData.preferences.barService === "Limited Open Bar" ? "15% more than beer & wine" : "standard beer & wine pricing"}
                                          )</p>
                                      )}
                                    </>
                                  )}
                                  
                                  {/* Venue Details */}
                                  {category.name === "Venue" && (
                                    <>
                                      <p>• Cost Structure: 70% fixed venue fee, 30% variable costs (setup, staffing, utilities)</p>
                                      <p>• Location: {budgetData.location.city}{budgetData.location.state ? `, ${budgetData.location.state}` : ''}</p>
                                      <p>• Location Impact: {budgetData.calculatedBudget.rationale.locationFactor > 1 ? 
                                        `${Math.round((budgetData.calculatedBudget.rationale.locationFactor - 1) * 100)}% premium for your area` : 
                                        'Standard pricing for your area'}</p>
                                      <p>• Day of Week: {budgetData.calculatedBudget.dayOfWeek === 'saturday' ? 'Saturday (peak pricing)' :
                                        budgetData.calculatedBudget.dayOfWeek === 'friday' ? 'Friday (10-15% savings)' :
                                        budgetData.calculatedBudget.dayOfWeek === 'sunday' ? 'Sunday (15-20% savings)' : 'Weekday (20-30% savings)'}</p>
                                    </>
                                  )}
                                  
                                  {/* Photography Details */}
                                  {category.name === "Photography" && (
                                    <>
                                      <p>• Cost Structure: 80% fixed (photographer's time), 20% variable (prints, albums, additional coverage)</p>
                                      {budgetData.preferences?.photoVideo && (
                                        <p>• Your Choice: {budgetData.preferences.photoVideo} (
                                          {budgetData.preferences.photoVideo === "Both Photography & Videography" ? "50% more than photo only" :
                                           budgetData.preferences.photoVideo === "Photography + Highlight Video" ? "30% more than photo only" : "standard photo package"}
                                          )</p>
                                      )}
                                      <p>• Coverage Hours: {budgetData.preferences?.coverageHours || "8"} hours</p>
                                    </>
                                  )}

                                  {/* Entertainment Details */}
                                  {category.name === "Entertainment" && (
                                    <>
                                      <p>• Cost Structure: 80% fixed base rate, 20% additional equipment/staff</p>
                                      {budgetData.preferences?.musicChoice ? (
                                        <p>• Your Choice: {budgetData.preferences.musicChoice} (
                                          {budgetData.preferences.musicChoice === "Playlist Only" ? 
                                            `80% savings from DJ rate (${formatCurrency(category.estimatedCost * 0.2)})` :
                                           budgetData.preferences.musicChoice === "Live Band Only" ? 
                                            `80% premium over DJ rate (${formatCurrency(category.estimatedCost * 1.8)})` :
                                           budgetData.preferences.musicChoice === "Both DJ & Band" ? 
                                            `100% premium over DJ rate (${formatCurrency(category.estimatedCost * 2.0)})` : 
                                            `Standard DJ rate (${formatCurrency(category.estimatedCost)})`}
                                        )</p>
                                      ) : (
                                        <p>• Tip: Different music choices can significantly impact your budget. Complete the entertainment survey to see exact costs.</p>
                                      )}
                                      {budgetData.preferences?.musicHours && (
                                        <p>• Hours Needed: {budgetData.preferences.musicHours} hours</p>
                                      )}
                                    </>
                                  )}

                                  {/* Hair and Make-up Details */}
                                  {category.name === "Hair_makeup" && (
                                    <>
                                      <p>• Cost Structure: 70% service costs, 20% products, 10% travel fees</p>
                                      {budgetData.preferences?.makeupFor && (
                                        <p>• Services For: {budgetData.preferences.makeupFor.join(", ")}</p>
                                      )}
                                      {budgetData.preferences?.makeupServices && (
                                        <p>• Includes: {budgetData.preferences.makeupServices.includes("trial") ? "Trials included" : "No trials"}</p>
                                      )}
                                      <p>• Cost per person: ${Math.round(category.estimatedCost / Math.max(1, budgetData.preferences?.makeupFor?.length || 1))}</p>
                                    </>
                                  )}

                                  {/* Flowers Details */}
                                  {category.name === "Flowers" && (
                                    <>
                                      <p>• Your Style: {budgetData.preferences?.floralStyle || "Simple & Classic"} (
                                        {budgetData.preferences?.floralStyle === "Elaborate & Luxurious" ? "50% more than simple & classic" :
                                         budgetData.preferences?.floralStyle === "Moderate" ? "25% more than simple & classic" : "standard pricing"}
                                        )</p>
                                      {budgetData.preferences?.diyElements?.includes("flowers") && (
                                        <p>• DIY Elements: Some floral elements will be DIY (15-25% potential savings)</p>
                                      )}
                                    </>
                                  )}

                                  {/* Transportation Details */}
                                  {category.name === "Transportation" && (
                                    <>
                                      <p>• Vehicle Type: {budgetData.preferences?.transportationType || "Standard sedan"} (
                                        {budgetData.preferences?.transportationType === "Luxury Sedan" ? "30% more than standard" :
                                         budgetData.preferences?.transportationType === "SUV" ? "40% more than standard" :
                                         budgetData.preferences?.transportationType === "Limo" ? "60% more than standard" :
                                         budgetData.preferences?.transportationType === "Party Bus" ? "80% more than standard" : "standard pricing"}
                                        )</p>
                                      <p>• Hours Needed: {budgetData.preferences?.transportationHours || "4"} hours</p>
                                    </>
                                  )}

                                  {/* Planning Details */}
                                  {category.name === "Planning" && (
                                    <>
                                      <p>• Service Level: {budgetData.preferences?.planningAssistance || "Month-of Coordinator"} (
                                        {budgetData.preferences?.planningAssistance === "Full Planning" ? "3x month-of coordinator" :
                                         budgetData.preferences?.planningAssistance === "Partial Planning" ? "2x month-of coordinator" : "standard month-of pricing"}
                                        )</p>
                                    </>
                                  )}

                                  {/* For other categories, show typical range */}
                                  {!["Catering", "Venue", "Photography", "Music", "Hair and Makeup", "Flowers", "Transportation", "Planning"].includes(category.name) && (
                                    <p>• Typical range for {category.name.toLowerCase()}: {formatCurrency(defaultTipsForCategory(category.name).ranges.min)} - {formatCurrency(defaultTipsForCategory(category.name).ranges.max)}</p>
                                  )}
                                </div>
                              </div>

                              {/* Budget Input */}
                              <div className="space-y-2">
                                <Label htmlFor={`budget-${category.id}`}>Adjust Budget</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id={`budget-${category.id}`}
                                    type="number"
                                    value={category.estimatedCost}
                                    onChange={(e) => handleCategoryUpdate(category.id, parseInt(e.target.value) || 0)}
                                    className="w-32"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </section>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}