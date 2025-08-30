"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { UserProfileDropdown } from "@/components/auth/user-profile-dropdown"

// Smooth scroll function
const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId.replace('#', ''))
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

const mainNav = [
  { name: "Features", href: "#features" },
  { name: "Interactive", href: "#interactive" },
  { name: "Visual Stories", href: "#visual-stories" },
  { name: "Blue Carbon", href: "#blue-carbon" },
  { name: "Interconnectivity", href: "#interconnectivity" },
  { name: "About", href: "#about" },
]

const dashboardNav = [
  {
    name: "Disaster Management",
    href: "/dashboard/disaster-management",
    description: "Tools and alerts for disaster response teams",
  },
  {
    name: "Coastal Government",
    href: "/dashboard/coastal-government",
    description: "Resources for local government officials",
  },
  {
    name: "Environmental NGOs",
    href: "/dashboard/environmental-ngo",
    description: "Environmental monitoring and collaboration",
  },
  {
    name: "Fisherfolk",
    href: "/dashboard/fisherfolk",
    description: "Maritime safety and weather alerts",
  },
  {
    name: "Civil Defence",
    href: "/dashboard/civil-defence",
    description: "Emergency response coordination",
  },
]

export function Navbar() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dashboardMenuOpen, setDashboardMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dashboard menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.dashboard-menu') && !target.closest('.dashboard-trigger')) {
        setDashboardMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Prevent hydration mismatch by showing loading state until mounted
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-gray-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-gray-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <ShieldAlert className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">CoastalAlert</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {mainNav.map((item) => (
              <button
                key={item.name}
                onClick={() => smoothScrollTo(item.href)}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                {item.name}
              </button>
            ))}
            
            {/* Dashboard Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDashboardMenuOpen(!dashboardMenuOpen)}
                className="dashboard-trigger flex items-center space-x-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <span>Dashboards</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${dashboardMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dashboardMenuOpen && (
                <div className="dashboard-menu absolute left-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {dashboardNav.map((item) => (
                    <Link
                      key={item.name}
                      href={user ? item.href : '/auth/login'}
                      className="block rounded-md px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => setDashboardMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            ) : user ? (
              <UserProfileDropdown />
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden md:inline-flex">
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild className="hidden md:inline-flex">
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </>
            )}
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-t border-gray-200 px-2 pb-3 pt-2 dark:border-gray-700">
            {mainNav.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  smoothScrollTo(item.href)
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {item.name}
              </button>
            ))}
            
            <div className="px-3 py-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Dashboards
              </div>
              <div className="mt-2 space-y-1">
                {dashboardNav.map((item) => (
                  <Link
                    key={item.name}
                    href={user ? item.href : '/auth/login'}
                    className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </Link>
                ))}
              </div>
            </div>
            
            {!user && !loading && (
              <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/sign-up">Create account</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
