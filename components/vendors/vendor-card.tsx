import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Vendor } from "@/lib/types"

interface VendorCardProps {
  vendor: Vendor
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link 
      href={vendor.category === "Catering" ? "/dashboard/room" : 
            vendor.category === "Decor & Florals" ? "/dashboard/coming-soon" : 
            `/dashboard/vendors/compare?vendor=${vendor.id}`} 
      className="block transition-opacity hover:opacity-90"
    >
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-video">
            <Image
              src={vendor.image || "/placeholder.svg"}
              alt={vendor.name}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold">{vendor.name}</h3>
          <p className="text-sm text-muted-foreground">{vendor.description}</p>
          <div className="mt-2">
            <p className="text-sm font-medium">Starting from {vendor.startingPrice}</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full" variant="secondary">View Details</Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

