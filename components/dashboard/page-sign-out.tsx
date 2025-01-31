"use client"

import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { storage } from "@/lib/storage"

export function PageSignOut() {
  const handleSignOut = () => {
    storage.clearUserData()
    window.location.href = "/"
  }

  const pathname = usePathname()

  // Only show on the main dashboard page
  if (pathname !== "/dashboard") return null

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut}>
      Sign Out
    </Button>
  )
}

