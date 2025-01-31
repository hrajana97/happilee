'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/vendors/file-upload"
import { ComparisonTable } from "@/components/vendors/comparison-table"
import { ComparisonSummary } from "@/components/vendors/comparison-summary"
import { AssistantTooltip } from '@/components/assistant/assistant-tooltip'
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

export interface MusicianPackage {
  id: string
  vendorName: string
  packageName: string
  price: number
  description: string
  includedServices: string[]
  additionalFees: { name: string; amount: number }[]
  terms: string[]
  hours: number
  type: 'DJ' | 'Band' | 'Solo' | 'Duo'
  memberCount?: number
  genres: string[]
  equipment: string[]
  category: 'musician'
}

// Sample musician data
const musicians = [
  {
    id: '1',
    name: 'Groove Masters Entertainment',
    packages: [
      {
        id: 'gm-1',
        vendorName: 'Groove Masters Entertainment',
        packageName: 'Premium DJ Package',
        price: 2500,
        description: 'Complete DJ and MC services for your entire event',
        includedServices: [
          'Professional DJ/MC',
          'Premium Sound System',
          'Dance Floor Lighting',
          'Wireless Microphones',
          'Ceremony Audio Support'
        ],
        additionalFees: [
          { name: 'Extra Hour', amount: 150 },
          { name: 'Additional Speaker Setup', amount: 200 }
        ],
        terms: [
          'Non-refundable deposit of 25%',
          'Final payment due 14 days before event',
          'Includes setup and breakdown time'
        ],
        hours: 6,
        type: 'DJ',
        genres: ['Pop', 'Hip Hop', 'R&B', 'Dance', 'Top 40'],
        equipment: ['Digital DJ Setup', 'PA System', 'LED Lighting', 'Wireless Mics'],
        category: 'musician' as const
      },
      {
        id: 'gm-2',
        vendorName: 'Groove Masters Entertainment',
        packageName: 'Basic DJ Package',
        price: 1800,
        description: 'Essential DJ services for reception',
        includedServices: [
          'Professional DJ',
          'Standard Sound System',
          'Basic Lighting'
        ],
        additionalFees: [
          { name: 'Extra Hour', amount: 150 },
          { name: 'MC Services', amount: 300 }
        ],
        terms: [
          'Non-refundable deposit of 25%',
          'Final payment due 14 days before event'
        ],
        hours: 4,
        type: 'DJ',
        genres: ['Pop', 'Hip Hop', 'R&B', 'Top 40'],
        equipment: ['Digital DJ Setup', 'PA System', 'Basic Lighting'],
        category: 'musician' as const
      }
    ]
  },
  {
    id: '2',
    name: 'The Wedding Band Co.',
    packages: [
      {
        id: 'wb-1',
        vendorName: 'The Wedding Band Co.',
        packageName: 'Full Band Experience',
        price: 5000,
        description: 'Live band performance for ceremony and reception',
        includedServices: [
          '5-Piece Band',
          'Ceremony Music',
          'Cocktail Hour',
          'Reception Performance',
          'MC Services'
        ],
        additionalFees: [
          { name: 'Additional Musician', amount: 500 },
          { name: 'Extra Hour', amount: 750 }
        ],
        terms: [
          'Non-refundable deposit of 33%',
          'Final payment due 30 days before event',
          'Includes all equipment and setup'
        ],
        hours: 6,
        type: 'Band',
        memberCount: 5,
        genres: ['Jazz', 'Pop', 'Rock', 'Soul', 'Standards'],
        equipment: ['Full Band Setup', 'Professional Sound System', 'Stage Lighting'],
        category: 'musician' as const
      }
    ]
  }
]

export default function CompareMusicianPage() {
  const [selectedPackages, setSelectedPackages] = useState<MusicianPackage[]>([])
  const [showAddManual, setShowAddManual] = useState(false)
  const [newPackage, setNewPackage] = useState<Partial<MusicianPackage>>({
    category: 'musician'
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

    const packageToAdd: MusicianPackage = {
      id: Date.now().toString(),
      vendorName: newPackage.vendorName,
      packageName: newPackage.packageName,
      price: newPackage.price,
      description: newPackage.description || '',
      includedServices: (newPackage.description || '').split('\n').filter(Boolean),
      additionalFees: [],
      terms: [],
      hours: newPackage.hours || 4,
      type: 'DJ',
      genres: [],
      equipment: [],
      category: 'musician'
    }

    setSelectedPackages(prev => [...prev, packageToAdd])
    setShowAddManual(false)
    setNewPackage({ category: 'musician' })
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard/vendors/musicians">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-sage-900">Compare Musicians</h1>
              <p className="mt-2 text-sage-600">Compare music packages and make informed decisions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AssistantTooltip
              tip="Export your comparison as a PDF or spreadsheet to share with others"
              side="bottom"
            >
              <Button variant="outline" onClick={handleExportComparison}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </AssistantTooltip>
            <Dialog open={showAddManual} onOpenChange={setShowAddManual}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Details Manually
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Music Package</DialogTitle>
                  <DialogDescription>
                    Manually add a musician's package to compare
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vendorName">Musician/Band Name</Label>
                    <Input
                      id="vendorName"
                      value={newPackage.vendorName || ''}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, vendorName: e.target.value }))}
                      placeholder="Enter musician or band name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="packageName">Package Name</Label>
                    <Input
                      id="packageName"
                      value={newPackage.packageName || ''}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, packageName: e.target.value }))}
                      placeholder="e.g., Premium DJ Package"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Package Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newPackage.price || ''}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="Enter package price"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hours">Performance Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      value={newPackage.hours || ''}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, hours: Number(e.target.value) }))}
                      placeholder="Enter performance hours"
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
                    <CardTitle>Select Musicians to Compare</CardTitle>
                    <CardDescription>
                      Choose packages to compare side by side
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {musicians.map((musician) => (
                    <Card key={musician.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{musician.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {musician.packages.map((pkg) => (
                            <div key={pkg.id} className="flex items-center gap-2">
                              <Checkbox
                                id={pkg.id}
                                checked={selectedPackages.some(p => p.id === pkg.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedPackages(prev => [...prev, pkg])
                                  } else {
                                    setSelectedPackages(prev =>
                                      prev.filter(p => p.id !== pkg.id)
                                    )
                                  }
                                }}
                              />
                              <label htmlFor={pkg.id} className="text-sm">
                                {pkg.packageName} - {pkg.price.toLocaleString()}
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
                      Upload musician proposals or pricing sheets
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
                        Compare music packages side by side
                      </CardDescription>
                    </div>
                    <AssistantTooltip
                      tip="Click on any row to see more details about that feature"
                      side="left"
                    >
                      <Button variant="ghost" size="icon">
                        <Table className="h-4 w-4" />
                      </Button>
                    </AssistantTooltip>
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
                <h3 className="text-lg font-medium text-sage-900 mb-2">
                  Select Packages to Compare
                </h3>
                <p className="text-sage-600 text-center max-w-md mb-6">
                  Choose music packages to compare or upload your own package details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

