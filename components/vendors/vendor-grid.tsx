import { VendorCard } from "./vendor-card"
import type { Vendor } from "@/lib/types"

interface VendorGridProps {
  vendors: Vendor[]
}

export function VendorGrid({ vendors }: VendorGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  )
}

