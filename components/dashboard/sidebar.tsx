"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "./notification-bell"

interface SidebarProps {
  userId: string
}

export function Sidebar({ userId }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/patients", label: "Patients", icon: "👥" },
    { href: "/controls", label: "Controls", icon: "📋" },
    { href: "/schedules", label: "Schedules", icon: "📅" },
    { href: "/reports", label: "Reports", icon: "📈" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
  ]

  return (
    <div className="w-64 border-r bg-muted/50 flex flex-col">
      <div className="p-6 border-b flex items-center justify-between">
        <h1 className="text-xl font-bold">Clinic Manager</h1>
        <NotificationBell userId={userId} />
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Button variant={pathname === link.href ? "default" : "ghost"} className="w-full justify-start" asChild>
              <span>
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </span>
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <form action="/auth/logout" method="post">
          <Button variant="outline" className="w-full bg-transparent">
            Logout
          </Button>
        </form>
      </div>
    </div>
  )
}
