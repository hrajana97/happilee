import type { Metadata } from "next"
import { Inter, DM_Sans } from 'next/font/google'
import "./globals.css"
import { validateConfig } from "@/lib/config"
import { logger } from "@/lib/debug"
import type React from "react"

// Load Inter for body text
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Load DM Sans for headings
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Happilai - Say yes to AI do!",
  description: "Plan your perfect wedding with AI-powered tools and expert guidance",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
  },
}

// Add config validation with detailed logging
const config = validateConfig()
logger.info("Application initialized with config:", config)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${dmSans.variable} ${inter.className}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

