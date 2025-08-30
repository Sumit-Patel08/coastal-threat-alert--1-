import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Shield, Users, MapPin, Phone, AlertTriangle, ClipboardList, Radio, Truck, Send, History, Activity, Settings, Bell, Zap, CheckCircle2, Clock, Target, Waves } from "lucide-react"
import { CivilDefenceAlertComposer } from "@/components/alerts/civil-defence-alert-composer"
import { AlertHistory } from "@/components/alerts/alert-history"

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
    <div className="flex-1 space-y-6 p-6 animate-in fade-in-0 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Civil Defence Operations
              </h1>
              <p className="text-muted-foreground">
                Emergency coordination and disaster response management
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>System Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>Configuration options would be available here.</p>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                <Zap className="h-4 w-4" />
                Emergency Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">Emergency Broadcast System</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">⚠️ This will send an immediate alert to all registered devices</p>
                </div>
                <Button variant="destructive" className="w-full">
                  <Radio className="mr-2 h-4 w-4" />
                  Activate Emergency Broadcast
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Emergency Status Banner */}
      {emergencyAlerts.some(alert => alert.severity === "Critical") && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-6 shadow-lg animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-full animate-bounce">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-800 text-lg">CRITICAL EMERGENCY ACTIVE</span>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                </div>
                <p className="text-red-700 mt-1">
                  Active cyclone warning in Chennai Coast. All teams on high alert.
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" className="gap-2">
              <Bell className="h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alert Management</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="preparedness">Preparedness</TabsTrigger>
          <TabsTrigger value="coordination">Coordination</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Active Teams</CardTitle>
                <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800">4</div>
                <p className="text-xs text-blue-600 font-medium">Response teams ready</p>
                <div className="mt-2">
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Total Personnel</CardTitle>
                <div className="p-2 bg-green-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800">41</div>
                <p className="text-xs text-green-600 font-medium">Civil defence members</p>
                <div className="mt-2">
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">Active Alerts</CardTitle>
                <div className="p-2 bg-red-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-800">3</div>
                <p className="text-xs text-red-600 font-medium">Emergency situations</p>
                <div className="mt-2">
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Evacuation Routes</CardTitle>
                <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-800">3</div>
                <p className="text-xs text-purple-600 font-medium">Active routes</p>
                <div className="mt-2">
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Team Status
                </CardTitle>
                <CardDescription>Current deployment status of response teams</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {teamStatus.map((team, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200 group">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          team.status === "Ready" ? "bg-green-500 animate-pulse" :
                          team.status === "Deployed" ? "bg-red-500" : "bg-yellow-500"
                        }`}></div>
                        <div>
                          <div className="font-semibold group-hover:text-blue-600 transition-colors">{team.team}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {team.members} members • 
                            <MapPin className="h-3 w-3" />
                            {team.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={team.status === "Ready" ? "default" : team.status === "Deployed" ? "destructive" : "secondary"} className="font-medium">
                          {team.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Target className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Emergency response tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200">
                      <Radio className="h-4 w-4" />
                      Emergency Broadcast
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Emergency Broadcast</DialogTitle>
                    </DialogHeader>
                    <p>Emergency broadcast system activated.</p>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200">
                      <Users className="h-4 w-4" />
                      Deploy Teams
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Team Deployment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>Select teams to deploy:</p>
                      {teamStatus.map((team, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span>{team.team}</span>
                          <Button size="sm" variant={team.status === "Ready" ? "default" : "secondary"}>
                            {team.status === "Ready" ? "Deploy" : team.status}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200" variant="outline">
                      <MapPin className="h-4 w-4" />
                      View Routes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Evacuation Routes</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {evacuationRoutes.map((route) => (
                        <div key={route.id} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{route.from} → {route.to}</h4>
                          <p className="text-sm text-muted-foreground">Capacity: {route.capacity}</p>
                          <Badge variant={route.status === "Active" ? "default" : "secondary"}>
                            {route.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200" variant="outline">
                      <Phone className="h-4 w-4" />
                      Contact HQ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Emergency Contacts</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Coast Guard Emergency</div>
                        <div className="text-lg font-mono">1554</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Civil Defence HQ</div>
                        <div className="text-lg font-mono">1800-425-1555</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Emergency Services</div>
                        <div className="text-lg font-mono">112</div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <CivilDefenceAlertComposer />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <AlertHistory />
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
