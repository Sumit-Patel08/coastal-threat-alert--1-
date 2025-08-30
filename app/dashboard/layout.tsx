import type React from "react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold">
            Coastal Threat Alert
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/#map" className="hover:text-foreground">
              Map
            </Link>
            <Link href="/#insights" className="hover:text-foreground">
              Insights
            </Link>
            <Link href="/#learn" className="hover:text-foreground">
              Learn
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Coastal Threat Alert
        </div>
      </footer>
    </div>
  )
}
