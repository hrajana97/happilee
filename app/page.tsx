"use client"

import { HomeClientWrapper } from "@/components/home/client-wrapper"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { DemoButton } from "@/components/demo-button"

export default function HomePage() {
  return (
    <HomeClientWrapper>
      <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-sage-50/30 to-white">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Logo />
            </div>
            <div></div>
          </div>
        </header>

        <main className="container py-24 bg-gradient-to-b from-sage-100 to-sage-300">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 text-[#738678]">happilee</h1> {/* Updated name */}
            <h2 className="mb-4 text-2xl sm:text-3xl font-medium tracking-tight text-sage-700">Say yes to AI do</h2>
            <p className="mb-8 text-lg text-sage-600">
              Plan your perfect wedding with AI-powered tools and expert guidance
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-[#738678] hover:bg-[#5f6e61]" asChild>
                <Link href="/onboarding">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-sage-200 hover:bg-sage-50" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </div>
            <div className="mt-4">
              <DemoButton />
            </div>
          </div>
        </main>
      </div>
    </HomeClientWrapper>
  )
}

