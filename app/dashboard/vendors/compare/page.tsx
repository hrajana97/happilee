'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

export interface VendorPackage {
  id: string
  vendorName: string
  packageName: string
  price: number
  description: string
  includedServices: string[]
  additionalFees: { name: string; amount: number }[]
  terms: string[]
  category: string
}

export default function ComparePage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const [packages, setPackages] = useState<VendorPackage[]>([])
  const [showAddManual, setShowAddManual] = useState(false)
  const router = useRouter()

  // Get the category title
  const getCategoryTitle = () => {
    if (!category) return 'Vendors'
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  const handleFileUpload = async (files: File[]) => {
    // In a real app, this would process the files and extract data
    console.log('Processing files:', files)
  }

  const handleExportComparison = () => {
    // In a real app, this would generate and download a PDF/spreadsheet
    console.log('Exporting comparison')
  }

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out');
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-sage-900">Compare {getCategoryTitle()}</h1>
            <p className="mt-2 text-sage-600">Compare vendor packages and make informed decisions</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={handleLogout} className="mr-2">
              Sign Out
            </Button>
            <Button variant="outline" onClick={handleExportComparison}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={showAddManual} onOpenChange={setShowAddManual}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Package
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Vendor Package</DialogTitle>
                  <DialogDescription>
                    Manually add a vendor package to compare
                  </DialogDescription>
                </DialogHeader>
                {/* Manual entry form will be added here */}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Vendor Documents</CardTitle>
              <CardDescription>
                Upload vendor proposals, pricing sheets, or package details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload onUpload={handleFileUpload} />
              <div className="flex items-center justify-between border-t pt-4">
                <p className="text-sm text-sage-600">
                  Supported formats: PDF, DOCX, XLS, XLSX, JPG, PNG
                </p>
                <Button variant="link" onClick={() => setShowAddManual(true)}>
                  Or enter details manually
                </Button>
              </div>
            </CardContent>
          </Card>

          {packages.length > 0 ? (
            <>
              <ComparisonSummary packages={packages} />
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Package Comparison</CardTitle>
                      <CardDescription>
                        Compare vendor packages side by side
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Table className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ComparisonTable packages={packages} />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Upload className="h-12 w-12 text-sage-400 mb-4" />
                <h3 className="text-lg font-medium text-sage-900 mb-2">
                  Start Comparing Vendors
                </h3>
                <p className="text-sage-600 text-center max-w-md mb-6">
                  Upload vendor documents or enter package details manually to start comparing options
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setShowAddManual(true)}>
                    Enter Manually
                  </Button>
                  <Button onClick={() => router.push('/dashboard/vendors')}>
                    Browse Vendors
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

