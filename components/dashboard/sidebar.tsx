"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Calendar,
  BarChart,
  Settings,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { NotificationBell } from "./notification-bell";
import Link from "next/link";

interface SidebarProps {
  userId: string;
  clinicName?: string;
  role: string; // Add role prop
}

export function Sidebar({ userId, clinicName, role }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Define menu links based on user role
  const getMenuLinks = () => {
    const baseLinks = [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/simple-dashboard", label: "Simple View", icon: Calendar }, // Mobile-friendly simplified view
      { href: "/patients", label: "Patients", icon: Users },
      { href: "/controls", label: "Controls", icon: Calendar },
      { href: "/schedules", label: "Schedules", icon: Calendar },
      { href: "/calendar", label: "Calendar", icon: Calendar }, // Added calendar link
      { href: "/reports", label: "Reports", icon: BarChart },
      { href: "/settings", label: "Settings", icon: Settings },
    ];

    // Only add admin link for super_admins
    if (role === "super_admin") {
      return [
        ...baseLinks,
        { href: "/admin", label: "Admin Panel", icon: Shield },
      ];
    }

    return baseLinks;
  };

  const links = getMenuLinks();

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <div
          className={`fixed top-0 left-0 h-full z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h1 className="text-xl font-bold">
                {clinicName || "Clinic Manager"}
              </h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant={pathname === link.href ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t flex items-center justify-between">
              <NotificationBell userId={userId} />
              <form action="/auth/logout" method="post">
                <Button variant="outline" className="bg-transparent">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="fixed top-4 left-4 z-40 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="w-64 border-r bg-muted/50 hidden md:flex md:flex-col">
      <div className="p-6 border-b flex items-center justify-between">
        <h1 className="text-xl font-bold">{clinicName || "Clinic Manager"}</h1>
        <NotificationBell userId={userId} />
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant={pathname === link.href ? "default" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <span>
                  <Icon className="mr-2 h-4 w-4" />
                  {link.label}
                </span>
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <form action="/auth/logout" method="post">
          <Button variant="outline" className="w-full bg-transparent">
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
