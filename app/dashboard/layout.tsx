import type * as React from "react"
import { DashboardClientWrapper } from "@/components/dashboard/client-wrapper"
import { AssistantProvider } from "@/components/assistant/assistant-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AssistantDialog } from "@/components/assistant/assistant-dialog"
import { DashboardNav } from "@/components/dashboard/nav"
import { PageSignOut } from "@/components/dashboard/page-sign-out"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardClientWrapper>
      <AssistantProvider>
        <SidebarProvider>
          <DashboardNav />
          <div className="absolute top-4 right-4">
            <PageSignOut />
          </div>
          <main className="transition-[margin] duration-300 ease-in-out">
            {children}
          </main>
          <AssistantDialog />
        </SidebarProvider>
      </AssistantProvider>
    </DashboardClientWrapper>
  )
}

