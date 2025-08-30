import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Users, MapPin, Phone, AlertTriangle, ClipboardList, Radio, Truck } from "lucide-react"

export default async function CivilDefenceDashboard() {
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

  if (profile?.role !== "civil_defence") {
    redirect("/dashboard")
  }

  // Mock data for hackathon MVP
  const emergencyAlerts = [
    { id: 1, type: "Cyclone Warning", severity: "Critical", location: "Chennai Coast", affected: "2.1M people", status: "Active" },
    { id: 2, type: "Flood Alert", severity: "High", location: "Mumbai Coast", affected: "1.8M people", status: "Monitoring" },
    { id: 3, type: "Sea Level Rise", severity: "Medium", location: "Kolkata Coast", affected: "1.2M people", status: "Resolved" },
  ]

  const preparednessChecklist = [
    { id: 1, item: "Emergency response vehicles fueled and ready", category: "Vehicles", completed: true },
    { id: 2, item: "Communication systems tested", category: "Communications", completed: true },
    { id: 3, item: "Emergency shelters inspected", category: "Shelters", completed: false },
    { id: 4, item: "Medical supplies restocked", category: "Medical", completed: true },
    { id: 5, item: "Evacuation routes verified", category: "Routes", completed: false },
    { id: 6, item: "Team members briefed on protocols", category: "Personnel", completed: true },
  ]

  const teamStatus = [
    { team: "Search & Rescue", members: 12, status: "Ready", location: "HQ" },
    { team: "Medical Response", members: 8, status: "Deployed", location: "Chennai Coast" },
    { team: "Evacuation", members: 15, status: "Standby", location: "HQ" },
    { team: "Communication", members: 6, status: "Ready", location: "HQ" },
  ]

  const evacuationRoutes = [
    { id: 1, from: "Chennai Beach", to: "Chennai Central Station", capacity: "5,000 people", status: "Active" },
    { id: 2, from: "Mumbai Marine Drive", to: "Bandra Station", capacity: "8,000 people", status: "Active" },
    { id: 3, from: "Kolkata Beach", to: "Howrah Station", capacity: "3,500 people", status: "Standby" },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Civil Defence Operations</h1>
          <p className="text-muted-foreground">
            Emergency coordination and disaster response management
          </p>
        </div>
        <Button variant="destructive">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Emergency Broadcast
        </Button>
      </div>

      {/* Emergency Status Banner */}
      {emergencyAlerts.some(alert => alert.severity === "Critical") && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">CRITICAL EMERGENCY</span>
          </div>
          <p className="text-red-700 text-sm mt-1">
            Active cyclone warning in Chennai Coast. All teams on high alert.
          </p>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="preparedness">Preparedness</TabsTrigger>
          <TabsTrigger value="coordination">Coordination</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Response teams ready</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Personnel</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">41</div>
                <p className="text-xs text-muted-foreground">Civil defence members</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Emergency situations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evacuation Routes</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Active routes</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Team Status</CardTitle>
                <CardDescription>Current deployment status of response teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamStatus.map((team, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{team.team}</div>
                        <div className="text-sm text-muted-foreground">{team.members} members • {team.location}</div>
                      </div>
                      <Badge variant={team.status === "Ready" ? "default" : team.status === "Deployed" ? "destructive" : "secondary"}>
                        {team.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Emergency response tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="destructive">
                  <Radio className="mr-2 h-4 w-4" />
                  Emergency Broadcast
                </Button>
                <Button className="w-full" variant="default">
                  <Users className="mr-2 h-4 w-4" />
                  Deploy Teams
                </Button>
                <Button className="w-full" variant="outline">
                  <MapPin className="mr-2 h-4 w-4" />
                  View Routes
                </Button>
                <Button className="w-full" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact HQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Operations</CardTitle>
              <CardDescription>Active emergency situations and response status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{alert.type}</h3>
                        <div className="text-sm text-muted-foreground">{alert.location} • {alert.affected} affected</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.severity === "Critical" ? "destructive" : alert.severity === "High" ? "default" : "secondary"}>
                          {alert.severity}
                        </Badge>
                        <Badge variant={alert.status === "Active" ? "destructive" : alert.status === "Monitoring" ? "default" : "secondary"}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Response Level</div>
                        <div className="text-muted-foreground">
                          {alert.severity === "Critical" ? "Full Response" : alert.severity === "High" ? "Enhanced Response" : "Standard Response"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Teams Deployed</div>
                        <div className="text-muted-foreground">
                          {alert.severity === "Critical" ? "All Teams" : alert.severity === "High" ? "3 Teams" : "1 Team"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Estimated Duration</div>
                        <div className="text-muted-foreground">
                          {alert.severity === "Critical" ? "24-48 hours" : alert.severity === "High" ? "12-24 hours" : "6-12 hours"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="destructive">Deploy Response</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preparedness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Disaster Preparedness Checklist</CardTitle>
              <CardDescription>Pre-emergency readiness verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {preparednessChecklist.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox checked={item.completed} />
                    <div className="flex-1">
                      <div className="font-medium">{item.item}</div>
                      <div className="text-sm text-muted-foreground">{item.category}</div>
                    </div>
                    <Badge variant={item.completed ? "default" : "secondary"}>
                      {item.completed ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Preparedness Score:</strong> {preparednessChecklist.filter(item => item.completed).length}/{preparednessChecklist.length} items complete
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coordination" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Evacuation Routes</CardTitle>
                <CardDescription>Active evacuation pathways and capacity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {evacuationRoutes.map((route) => (
                    <div key={route.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{route.from} → {route.to}</h3>
                        <Badge variant={route.status === "Active" ? "default" : "secondary"}>
                          {route.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Capacity: {route.capacity}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Route</Button>
                        <Button size="sm" variant="outline">Update Status</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Hub</CardTitle>
                <CardDescription>Emergency communication channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="default">
                  <Radio className="mr-2 h-4 w-4" />
                  Emergency Radio
                </Button>
                <Button className="w-full" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Team Communications
                </Button>
                <Button className="w-full" variant="outline">
                  <Truck className="mr-2 h-4 w-4" />
                  Vehicle Dispatch
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Personnel Status
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Map Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Operational Map</CardTitle>
              <CardDescription>Team deployments and evacuation routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Interactive operational map would be displayed here</p>
                  <p className="text-sm">Showing team locations, evacuation routes, and emergency zones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
