'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

export function DashboardClientWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const isAuth = localStorage.getItem('happily_auth')
        if (!isAuth) {
          router.push('/login')
        } else {
          setIsLoading(false)
        }
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage-200 border-t-sage-600" />
      </div>
    )
  }

  return <>{children}</>
}

