'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function HomeClientWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('happily_onboarding_complete')
    if (hasCompletedOnboarding) {
      router.push('/dashboard')
    }
  }, [router])

  return <>{children}</>
}

