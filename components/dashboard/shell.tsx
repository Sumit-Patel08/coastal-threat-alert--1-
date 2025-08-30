import type React from "react"
import Link from "next/link"

type Tab = { href: string; label: string }

export function DashboardShell({
  role,
  tabs = [
    { href: "#overview", label: "Overview" },
    { href: "#alerts", label: "Alerts" },
    { href: "#map", label: "Map" },
    { href: "#insights", label: "Insights" },
    { href: "#settings", label: "Settings" },
  ],
  children,
}: {
  role: string
  tabs?: Tab[]
  children: React.ReactNode
}) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-pretty text-2xl font-semibold md:text-3xl">{role} Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Demo UI using mock data. Role-based access will be enforced with Supabase auth.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <a
            key={t.href}
            href={t.href}
            className="rounded border px-3 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
          >
            {t.label}
          </a>
        ))}
        <Link href="/dashboard" className="ml-auto text-xs underline underline-offset-4">
          Switch role
          <span className="sr-only">Return to dashboard role picker</span>
        </Link>
      </div>
      <div>{children}</div>
    </section>
  )
}
