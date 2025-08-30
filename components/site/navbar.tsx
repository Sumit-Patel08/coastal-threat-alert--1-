"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { UserProfileDropdown } from "@/components/auth/user-profile-dropdown"
import { useEffect, useState } from "react"

export function Navbar() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by showing loading state until mounted
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold">
            Coastal Threat Alert
            <span className="sr-only">Home</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#map" className="text-sm text-muted-foreground hover:text-foreground">
              Map
            </Link>
            <Link href="#insights" className="text-sm text-muted-foreground hover:text-foreground">
              Insights
            </Link>
            <Link href="#learn" className="text-sm text-muted-foreground hover:text-foreground">
              Learn
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          Coastal Threat Alert
          <span className="sr-only">Home</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="#map" className="text-sm text-muted-foreground hover:text-foreground">
            Map
          </Link>
          <Link href="#insights" className="text-sm text-muted-foreground hover:text-foreground">
            Insights
          </Link>
          <Link href="#learn" className="text-sm text-muted-foreground hover:text-foreground">
            Learn
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <UserProfileDropdown />
          ) : (
            <>
              <Button asChild variant="default" className="hidden md:inline-flex">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild variant="outline" className="md:hidden bg-transparent">
                <Link href="/auth/login">Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
