"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { storage } from "@/lib/storage"
import { Logo } from "@/components/ui/logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // In a real app, this would validate against a backend
      if (email && password) {
        // Store auth state
        localStorage.setItem("happily_auth", "true")
        localStorage.setItem("happily_user_type", "returning")

        // Store email for the user data
        const userData = storage.getUserData()
        storage.setUserData({
          ...userData,
          email,
        })

        router.push("/dashboard")
      } else {
        setError("Please fill in all fields")
      }
    } catch (err) {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50/50 to-white p-8">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-[#738678]">Welcome back!</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to continue planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#738678] hover:bg-[#5f6e61]">
                  Sign In
                </Button>
                <div className="text-center space-y-2">
                  <p className="text-sm text-sage-600">
                    Don't have an account yet?{" "}
                    <Link href="/onboarding" className="text-sage-700 hover:underline">
                      Get Started
                    </Link>
                  </p>
                  <Button
                    variant="link"
                    asChild
                    className="text-sage-600"
                    onClick={() => {
                      // Set demo mode in localStorage
                      localStorage.setItem("happily_auth", "true")
                      localStorage.setItem("happily_user_type", "demo")
                    }}
                  >
                    <Link href="/dashboard">Try Demo →</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

