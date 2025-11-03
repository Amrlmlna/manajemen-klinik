"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            CM
          </div>
          <span className="hidden font-semibold md:inline-block">Clinic Manager</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Benefits
          </Link>
          <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setIsOpen(!isOpen)}>
          <div className="h-0.5 w-5 bg-foreground"></div>
          <div className="h-0.5 w-5 bg-foreground"></div>
          <div className="h-0.5 w-5 bg-foreground"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-3">
          <Link href="#features" className="block text-sm text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="#benefits" className="block text-sm text-muted-foreground hover:text-foreground">
            Benefits
          </Link>
          <Link href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Link href="/auth/login" className="block text-sm text-muted-foreground hover:text-foreground">
            Login
          </Link>
        </div>
      )}
    </nav>
  )
}
