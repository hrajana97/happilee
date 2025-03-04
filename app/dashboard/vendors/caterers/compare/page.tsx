'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/vendors/file-upload"
import { ComparisonTable } from "@/components/vendors/comparison-table"
import { ComparisonSummary } from "@/components/vendors/comparison-summary"
import { Download, Upload, Table, Plus, ArrowLeft } from 'lucide-react'
import {
Dialog,
DialogContent,
DialogDescription,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Link from 'next/link'

export interface CatererPackage {
id: string
vendorName: string
packageName: string
price: number
description: string
includedServices: string[]
additionalFees: { name: string; amount: number }[]
terms: string[]
pricePerPerson: number
minimumGuests: number
serviceStyle: 'Buffet' | 'Plated' | 'Family Style' | 'Stations'
menuItems: {
  appetizers: string[]
  entrees: string[]
  sides: string[]
  desserts: string[]
}
staffing: {
  servers: number
  chefs: number
  bartenders: number
}
dietaryOptions: string[]
category: 'caterer'
}

// Sample caterer data
const caterers = [
{
  id: '1',
  name: 'Elegant Eats Catering',
  packages: [
    {
      id: 'ee-1',
      vendorName: 'Elegant Eats Catering',
      packageName: 'Premium Plated Package',
      price: 15000,
      pricePerPerson: 150,
      description: 'Luxury plated service with premium menu options',
      includedServices: [
        'Full-Service Staff',
        'China & Flatware',
        'Kitchen Equipment',
        'Bar Service Setup',
        'Menu Tasting'
      ],
      additionalFees: [
        { name: 'Additional Server', amount: 200 },
        { name: 'Special Equipment', amount: 500 }
      ],
      terms: [
        'Non-refundable deposit of 25%',
        'Final guest count due 14 days prior',
        'Final payment due 7 days before event'
      ],
      minimumGuests: 50,
      serviceStyle: 'Plated',
      menuItems: {
        appetizers: ['Seared Scallops', 'Duck Confit', 'Wild Mushroom Tartlets'],
        entrees: ['Filet Mignon', 'Sea Bass', 'Vegetable Wellington'],
        sides: ['Truffle Mashed Potatoes', 'Grilled Asparagus', 'Wild Rice Pilaf'],
        desserts: ['Chocolate Soufflé', 'Crème Brûlée', 'Berry Tart']
      },
      staffing: {
        servers: 8,
        chefs: 2,
        bartenders: 2
      },
      dietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'],
      category: 'caterer' as const
    },
    {
      id: 'ee-2',
      vendorName: 'Elegant Eats Catering',
      packageName: 'Classic Buffet Package',
      price: 10000,
      pricePerPerson: 100,
      description: 'Traditional buffet service with classic menu options',
      includedServices: [
        'Buffet Staff',
        'Buffet Equipment',
        'Standard Place Settings',
        'Menu Tasting'
      ],
      additionalFees: [
        { name: 'Additional Server', amount: 200 },
        { name: 'Carving Station', amount: 350 }
      ],
      terms: [
        'Non-refundable deposit of 25%',
        'Final guest count due 14 days prior',
        'Final payment due 7 days before event'
      ],
      minimumGuests: 40,
      serviceStyle: 'Buffet',
      menuItems: {
        appetizers: ['Bruschetta', 'Stuffed Mushrooms', 'Caesar Salad'],
        entrees: ['Chicken Marsala', 'Roasted Salmon', 'Pasta Primavera'],
        sides: ['Roasted Potatoes', 'Seasonal Vegetables', 'Rice Pilaf'],
        desserts: ['Tiramisu', 'Cheesecake', 'Fruit Tart']
      },
      staffing: {
        servers: 6,
        chefs: 1,
        bartenders: 1
      },
      dietaryOptions: ['Vegetarian', 'Gluten-Free'],
      category: 'caterer' as const
    }
  ]
},
{
  id: '2',
  name: 'Global Fusion Catering',
  packages: [
    {
      id: 'gf-1',
      vendorName: 'Global Fusion Catering',
      packageName: 'International Stations',
      price: 12000,
      pricePerPerson: 120,
      description: 'Interactive food stations featuring global cuisine',
      includedServices: [
        'Station Attendants',
        'Display Equipment',
        'Action Stations',
        'Menu Tasting'
      ],
      additionalFees: [
        { name: 'Additional Station', amount: 500 },
        { name: 'Live Cooking Demo', amount: 300 }
      ],
      terms: [
        'Non-refundable deposit of 30%',
        'Final guest count due 10 days prior',
        'Final payment due 7 days before event'
      ],
      minimumGuests: 75,
      serviceStyle: 'Stations',
      menuItems: {
        appetizers: ['Sushi Display', 'Mediterranean Mezze', 'Asian Dumplings'],
        entrees: ['Pad Thai Station', 'Taco Bar', 'Pasta Station'],
        sides: ['Asian Slaw', 'Mexican Rice', 'Grilled Vegetables'],
        desserts: ['Mini Desserts', 'Crepe Station', 'Global Cookies']
      },
      staffing: {
        servers: 6,
        chefs: 3,
        bartenders: 2
      },
      dietaryOptions: ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free'],
      category: 'caterer' as const
    }
  ]
}
]

export default function CompareCaterersPage() {
const [selectedPackages, setSelectedPackages] = useState<CatererPackage[]>([])
const [showAddManual, setShowAddManual] = useState(false)
const [newPackage, setNewPackage] = useState<Partial<CatererPackage>>({
  category: 'caterer'
})

const handleFileUpload = async (files: File[]) => {
  // In a real app, this would process the files and extract data
  console.log('Processing files:', files)
}

const handleExportComparison = () => {
  // In a real app, this would generate and download a PDF/spreadsheet
  console.log('Exporting comparison')
}

const handleAddPackage = () => {
  if (!newPackage.vendorName || !newPackage.packageName || !newPackage.price) return

  const packageToAdd: CatererPackage = {
    id: Date.now().toString(),
    vendorName: newPackage.vendorName,
    packageName: newPackage.packageName,
    price: newPackage.price,
    pricePerPerson: newPackage.pricePerPerson || 0,
    description: newPackage.description || '',
    includedServices: (newPackage.description || '').split('\n').filter(Boolean),
    additionalFees: [],
    terms: [],
    minimumGuests: newPackage.minimumGuests || 50,
    serviceStyle: 'Buffet',
    menuItems: {
      appetizers: [],
      entrees: [],
      sides: [],
      desserts: []
    },
    staffing: {
      servers: 0,
      chefs: 0,
      bartenders: 0
    },
    dietaryOptions: [],
    category: 'caterer'
  }

  setSelectedPackages(prev => [...prev, packageToAdd])
  setShowAddManual(false)
  setNewPackage({ category: 'caterer' })
}

const handlePackageSelection = (pkg: CatererPackage, checked: boolean) => {
  try {
    if (checked) {
      setSelectedPackages(prev => [...prev, pkg])
    } else {
      setSelectedPackages(prev => prev.filter(p => p.id !== pkg.id))
    }
  } catch (error) {
    console.error('Error handling package selection:', error)
  }
}

return (
  <div className="p-8">
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/vendors/caterers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-sage-900">Compare Caterers</h1>
            <p className="mt-2 text-sage-600">Compare catering packages and make informed decisions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportComparison}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={showAddManual} onOpenChange={setShowAddManual}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Details Manually
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Catering Package</DialogTitle>
                <DialogDescription>
                  Manually add a caterer's package to compare
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="vendorName">Caterer Name</Label>
                  <Input
                    id="vendorName"
                    value={newPackage.vendorName || ''}
                    onChange={(e) => setNewPackage(prev => ({ ...prev, vendorName: e.target.value }))}
                    placeholder="Enter caterer's name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="packageName">Package Name</Label>
                  <Input
                    id="packageName"
                    value={newPackage.packageName || ''}
                    onChange={(e) => setNewPackage(prev => ({ ...prev, packageName: e.target.value }))}
                    placeholder="e.g., Premium Buffet Package"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Total Package Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newPackage.price || ''}
                    onChange={(e) => setNewPackage(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="Enter total package price"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pricePerPerson">Price Per Person</Label>
                  <Input
                    id="pricePerPerson"
                    type="number"
                    value={newPackage.pricePerPerson || ''}
                    onChange={(e) => setNewPackage(prev => ({ ...prev, pricePerPerson: Number(e.target.value) }))}
                    placeholder="Enter price per person"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minimumGuests">Minimum Guest Count</Label>
                  <Input
                    id="minimumGuests"
                    type="number"
                    value={newPackage.minimumGuests || ''}
                    onChange={(e) => setNewPackage(prev => ({ ...prev, minimumGuests: Number(e.target.value) }))}
                    placeholder="Enter minimum guest count"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Included Services</Label>
                  <Textarea
                    id="description"
                    value={newPackage.description || ''}
                    onChange={(e) => setNewPackage(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter included services (one per line)"
                    className="min-h-[100px]"
                  />
                </div>
                <Button onClick={handleAddPackage}>
                  Add Package
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Caterers to Compare</CardTitle>
                  <CardDescription>
                    Choose packages to compare side by side
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {caterers.map((caterer) => (
                  <Card key={caterer.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{caterer.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {caterer.packages.map((pkg) => (
                          <div key={pkg.id} className="flex items-center gap-2">
                            <Checkbox
                              id={pkg.id}
                              checked={selectedPackages.some(p => p.id === pkg.id)}
                              onCheckedChange={(checked) => {
                                handlePackageSelection(pkg, checked as boolean)
                              }}
                            />
                            <label htmlFor={pkg.id} className="text-sm">
                              {pkg.packageName} - ${pkg.pricePerPerson} per person
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upload Package Details</CardTitle>
                  <CardDescription>
                    Upload catering proposals or pricing sheets
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <FileUpload onUpload={handleFileUpload} />
            </CardContent>
          </Card>
        </div>

        {selectedPackages.length > 0 && (
          <>
            <ComparisonSummary packages={selectedPackages} />

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Package Comparison</CardTitle>
                    <CardDescription>
                      Compare catering packages side by side
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Table className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ComparisonTable packages={selectedPackages} />
              </CardContent>
            </Card>
          </>
        )}

        {selectedPackages.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="h-12 w-12 text-sage-400 mb-4" />
              <h3 className="text-lg font-medium text-sage-900 mb-2">
                Select Packages to Compare
              </h3>
              <p className="text-sage-600 text-center max-w-md mb-6">
                Choose catering packages to compare or upload your own package details
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  </div>
)
}

