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
        <main className="flex-1 flex justify-center bg-[linear-gradient(180deg,#E8EDE8_0%,#F4F7F4_50%,#FFFFFF_100%)]">
          <div className="w-full max-w-7xl px-4 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
} 