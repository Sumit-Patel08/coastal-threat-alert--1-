import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Building2, Shield, Leaf, Fish, Users } from "lucide-react"

type Tab = { href: string; label: string }

const roleConfig = {
  disaster_management: {
    title: "Disaster Management Department",
    description: "Monitor coastal threats and coordinate emergency responses",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  coastal_government: {
    title: "Coastal City Government",
    description: "Regional monitoring and policy management for coastal cities",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  environmental_ngo: {
    title: "Environmental NGO",
    description: "Monitor coastal ecosystems and environmental threats",
    icon: Leaf,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  fisherfolk: {
    title: "Fisherfolk",
    description: "Stay safe with real-time coastal alerts and conditions",
    icon: Fish,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  civil_defence: {
    title: "Civil Defence Team",
    description: "Emergency coordination and disaster response management",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  }
}

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
  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.fisherfolk
  const IconComponent = config.icon

  return (
    <section className="space-y-6">
      {/* Role Header */}
      <Card className={`${config.bgColor} ${config.borderColor} border`}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor} ${config.color}`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl">{config.title}</CardTitle>
              <CardDescription className="text-sm">{config.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
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
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {role.replace('_', ' ').toUpperCase()}
              </Badge>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Switch Role
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>{children}</div>
    </section>
  )
}
