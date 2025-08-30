import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, MapPin, FileText, TrendingUp, Shield, Users } from "lucide-react"

export default async function CoastalGovernmentDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has the correct role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "coastal_government") {
    redirect("/dashboard")
  }

  // Mock data for hackathon MVP
  const cityData = [
    { city: "Mumbai", population: "20.4M", risk: "High", alerts: 5, policies: 12 },
    { city: "Chennai", population: "11.2M", risk: "Medium", alerts: 3, policies: 8 },
    { city: "Kolkata", population: "14.8M", risk: "High", alerts: 4, policies: 15 },
    { city: "Kochi", population: "2.1M", risk: "Low", alerts: 1, policies: 6 },
  ]

  const policyInsights = [
    { title: "Coastal Zone Regulation", status: "Active", impact: "High", lastUpdated: "2 days ago" },
    { title: "Flood Prevention Protocol", status: "Draft", impact: "Medium", lastUpdated: "1 week ago" },
    { title: "Emergency Response Plan", status: "Active", impact: "Critical", lastUpdated: "3 days ago" },
    { title: "Environmental Protection", status: "Review", impact: "High", lastUpdated: "5 days ago" },
  ]

  const regionalAlerts = [
    { id: 1, city: "Mumbai", type: "Sea Level Rise", severity: "High", affected: "2.1M people" },
    { id: 2, city: "Chennai", type: "Cyclone Warning", severity: "Critical", affected: "1.8M people" },
    { id: 3, city: "Kolkata", type: "Flood Alert", severity: "Medium", affected: "3.2M people" },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coastal City Government Dashboard</h1>
          <p className="text-muted-foreground">
            Regional monitoring and policy management for coastal cities
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Policy Center
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="regional">Regional Monitoring</TabsTrigger>
          <TabsTrigger value="policies">Policy Insights</TabsTrigger>
          <TabsTrigger value="alerts">City Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cities</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Coastal cities monitored</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Population</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48.5M</div>
                <p className="text-xs text-muted-foreground">Affected population</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">41</div>
                <p className="text-xs text-muted-foreground">+3 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk Cities</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Mumbai & Kolkata</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>City Overview</CardTitle>
                <CardDescription>Status of monitored coastal cities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cityData.map((city, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{city.city}</div>
                        <div className="text-sm text-muted-foreground">
                          Population: {city.population} | Policies: {city.policies}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={city.risk === "High" ? "destructive" : city.risk === "Medium" ? "default" : "secondary"}>
                          {city.risk} Risk
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">{city.alerts} alerts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Government response tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="default">
                  <MapPin className="mr-2 h-4 w-4" />
                  Regional Maps
                </Button>
                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Policy Review
                </Button>
                <Button className="w-full" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Forecast Reports
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Public Notices
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Monitoring Dashboard</CardTitle>
              <CardDescription>Real-time monitoring of coastal regions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cityData.map((city, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">{city.city}</h3>
                      <Badge variant={city.risk === "High" ? "destructive" : city.risk === "Medium" ? "default" : "secondary"}>
                        {city.risk} Risk
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Population</div>
                        <div className="text-muted-foreground">{city.population}</div>
                      </div>
                      <div>
                        <div className="font-medium">Active Alerts</div>
                        <div className="text-muted-foreground">{city.alerts}</div>
                      </div>
                      <div>
                        <div className="font-medium">Policies</div>
                        <div className="text-muted-foreground">{city.policies}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Management</CardTitle>
              <CardDescription>Coastal protection and emergency response policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {policyInsights.map((policy, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{policy.title}</div>
                      <div className="text-sm text-muted-foreground">Last updated: {policy.lastUpdated}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={policy.status === "Active" ? "default" : policy.status === "Draft" ? "secondary" : "outline"}>
                        {policy.status}
                      </Badge>
                      <Badge variant={policy.impact === "Critical" ? "destructive" : policy.impact === "High" ? "default" : "secondary"}>
                        {policy.impact} Impact
                      </Badge>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>City-Specific Alerts</CardTitle>
              <CardDescription>Alerts affecting coastal city zones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {regionalAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{alert.type}</div>
                      <div className="text-sm text-muted-foreground">{alert.city} • {alert.affected}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.severity === "Critical" ? "destructive" : alert.severity === "High" ? "default" : "secondary"}>
                        {alert.severity}
                      </Badge>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
