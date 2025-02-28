"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/ui/logo"
import { Users, DollarSign, FileText, Image, Calendar, Heart, Home } from "lucide-react"
import * as React from "react"
import { storage } from "@/lib/storage"

export function DashboardNav() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const dialogId = React.useId()
  //const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const sidebarNavItems = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Budget",
      href: "/dashboard/budget",
      icon: DollarSign,
    },
    {
      title: "Moodboard",
      href: "/dashboard/moodboard",
      icon: Image,
    },
    {
      title: "Vendors",
      href: "/dashboard/vendors",
      icon: Users,
    },
    {
      title: "Contracts",
      href: "/dashboard/contracts",
      icon: FileText,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
    },
  ]

  return (
    <>
      <div className={cn(
        "fixed left-0 top-4 z-50 transition-all duration-200",
        state === "collapsed" ? "ml-4" : "ml-[16rem]"
      )}>
        <SidebarTrigger className="bg-white shadow-md hover:bg-sage-50" />
      </div>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <Logo 
              className={cn(
                "transition-all duration-200",
                state === "collapsed" ? "w-8" : "w-8"
              )}
              showText={state !== "collapsed"}
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {sidebarNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === item.href && "bg-sage-300 text-sage-700",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className={cn(
                    "transition-opacity duration-200",
                    state === "collapsed" ? "opacity-0" : "opacity-100"
                  )}>{item.title}</span>
                </Link>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <button
                className="ml-auto w-full flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-sage-50"
                onClick={() => {
                  storage.clearUserData()
                  window.location.href = "/"
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                  <path d="M7 12h14l-3 -3m0 6l3 -3" />
                </svg>
                <span className={cn(
                  "transition-opacity duration-200",
                  state === "collapsed" ? "opacity-0" : "opacity-100"
                )}>Sign Out</span>
              </button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </>
  )
}

