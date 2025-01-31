"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, AlertTriangle } from "lucide-react"
import type { VendorPackage } from "@/app/dashboard/vendors/compare/page"

interface ComparisonSummaryProps {
  packages: VendorPackage[]
}

export function ComparisonSummary({ packages }: ComparisonSummaryProps) {
  const getBestValue = () => {
    return packages.reduce((best, current) => {
      const currentValue = current.includedServices.length / current.price
      const bestValue = best.includedServices.length / best.price
      return currentValue > bestValue ? current : best
    })
  }

  const bestValue = getBestValue()

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="w-full md:w-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Best Value
          </CardTitle>
          <CardDescription>Package with the most included services per dollar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-x-4">
            <div className="text-lg font-medium">{bestValue.vendorName}</div>
            <p className="text-sm text-sage-600">{bestValue.packageName}</p>
            <div className="flex flex-wrap gap-1">
              {bestValue.includedServices.map((service) => (
                <Badge key={service} variant="outline">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

