import type { BudgetPreferences, CalculatedBudget, UserData } from "@/types/budget";

const isBrowser = typeof window !== 'undefined'

export const storage = {
  setUserData: (data: Partial<UserData>) => {
    if (!isBrowser) return
    const existing = storage.getUserData()
    const updated = { ...existing, ...data }
    localStorage.setItem('happilai_user_data', JSON.stringify(updated))
  },

  getUserData: (): Partial<UserData> => {
    if (!isBrowser) return {}
    try {
      const data = localStorage.getItem('happilai_user_data')
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Error reading user data:', error)
      return {}
    }
  },

  clearUserData: () => {
    if (!isBrowser) return
    localStorage.removeItem('happilai_user_data')
    localStorage.removeItem('happilai_auth')
    localStorage.removeItem('happilai_user_type')
  },

  isAuthenticated: (): boolean => {
    if (!isBrowser) return false
    return !!localStorage.getItem('happily_auth')
  }
}

