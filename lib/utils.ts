import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const isBrowser = typeof window !== "undefined"

export function safeLocalStorage(key: string, value?: string): string | null {
  if (!isBrowser) return null

  if (value !== undefined) {
    try {
      localStorage.setItem(key, value)
      return value
    } catch (e) {
      console.error("Error writing to localStorage:", e)
      return null
    }
  }

  try {
    return localStorage.getItem(key)
  } catch (e) {
    console.error("Error reading from localStorage:", e)
    return null
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

