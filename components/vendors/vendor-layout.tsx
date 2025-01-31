import { ReactNode } from "react"

interface VendorLayoutProps {
  children: ReactNode
}

export function VendorLayout({ children }: VendorLayoutProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

