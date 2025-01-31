'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ComingSoonPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <Button variant="ghost" size="icon" asChild className="mb-8">
          <Link href="/dashboard/vendors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-semibold text-sage-900 mb-4">Coming Soon</h1>
            <p className="text-sage-600 text-center max-w-md mb-6">
              We're working hard to bring you this feature. Check back soon!
            </p>
            <Button asChild>
              <Link href="/dashboard/vendors">
                Return to Vendors
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

