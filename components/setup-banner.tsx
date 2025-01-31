'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { storage } from '@/lib/storage'

export function SetupBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isReturningUser, setIsReturningUser] = useState(false)

  useEffect(() => {
    setIsReturningUser(localStorage.getItem('happilai_user_type') === 'returning')
  }, [])

  const handleSetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      // In a real app, this would create an account in the backend
      localStorage.setItem('happilai_auth', 'true')
      localStorage.setItem('happilai_user_type', 'registered')
      
      // Store email in user data
      const userData = storage.getUserData()
      storage.setUserData({
        ...userData,
        email
      })

      setShowDialog(false)
      setDismissed(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  // Don't show banner for returning users
  if (isReturningUser || dismissed) {
    return null
  }

  return (
    <>
      <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-sage-50 to-sage-100 px-6 py-4 sm:px-3.5 border-b border-sage-200 md:ml-[16rem]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm leading-6 text-sage-900">
            <strong className="font-semibold">Loving your wedding plan?</strong>
            <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
              <circle cx={1} cy={1} r={1} />
            </svg>
            Create a free account to save your progress and come back anytime!
          </p>
          <Button
            size="sm"
            className="bg-sage-600 hover:bg-sage-700 shadow-sm"
            onClick={() => setShowDialog(true)}
          >
            Create Account <span aria-hidden="true">&rarr;</span>
          </Button>
        </div>
        <div className="flex flex-1 justify-end">
          <button
            type="button"
            className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
            onClick={() => setDismissed(true)}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5 text-sage-900" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
            <DialogDescription>
              Save your wedding planning progress and access it from anywhere
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSetup} className="space-y-4 pt-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="setup-email">Email</Label>
              <Input
                id="setup-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="setup-password">Password</Label>
              <Input
                id="setup-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Maybe Later
              </Button>
              <Button type="submit" className="bg-sage-600 hover:bg-sage-700">
                Create Account
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

