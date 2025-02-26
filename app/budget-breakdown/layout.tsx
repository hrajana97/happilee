import * as React from "react"
import { DashboardNav } from "@/components/dashboard/nav"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function BudgetBreakdownLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <DashboardNav />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
} 