'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DemoButton() {
  return (
    <Button 
      variant="link" 
      className="text-[#738678] hover:text-[#5f6e61]" 
      onClick={() => {
        localStorage.setItem('happily_auth', 'true')
        localStorage.setItem('happily_user_type', 'demo')
      }}
      asChild
    >
      <Link href="/dashboard">Try Demo</Link>
    </Button>
  )
}

