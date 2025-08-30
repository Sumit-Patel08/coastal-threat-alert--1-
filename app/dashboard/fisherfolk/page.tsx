import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Fish, AlertTriangle, MapPin, Phone, Shield, Waves, Sun, CloudRain } from "lucide-react"

export default async function FisherfolkDashboard() {
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

  if (profile?.role !== "fisherfolk") {
    redirect("/dashboard")
  }

  // Mock data for hackathon MVP
  const liveAlerts = [
    { id: 1, type: "Sea Level Rise", severity: "High", location: "Nearby Coast", time: "1 hour ago", action: "Return to shore" },
    { id: 2, type: "Cyclone Warning", severity: "Critical", location: "50km offshore", time: "3 hours ago", action: "Seek shelter immediately" },
    { id: 3, type: "Strong Currents", severity: "Medium", location: "Fishing zone A", time: "5 hours ago", action: "Use caution" },
  ]

  const safetyTips = [
    { id: 1, tip: "Always check weather forecast before going to sea", category: "Weather" },
    { id: 2, tip: "Keep emergency contacts readily available", category: "Safety" },
    { id: 3, tip: "Monitor sea level changes during high tide", category: "Navigation" },
    { id: 4, tip: "Avoid fishing during cyclone warnings", category: "Weather" },
    { id: 5, tip: "Carry life jackets and safety equipment", category: "Safety" },
  ]

  const coastalConditions = [
    { location: "Current Zone", seaLevel: "Normal", windSpeed: "15 km/h", visibility: "Good", fishing: "Safe" },
    { location: "Nearby Harbor", seaLevel: "High", windSpeed: "25 km/h", visibility: "Moderate", fishing: "Caution" },
    { location: "Deep Water", seaLevel: "Normal", windSpeed: "20 km/h", visibility: "Good", fishing: "Safe" },
  ]

  const weatherForecast = [
    { time: "Now", condition: "Sunny", temp: "28°C", wind: "15 km/h" },
    { time: "2 PM", condition: "Partly Cloudy", temp: "30°C", wind: "18 km/h" },
    { time: "4 PM", condition: "Cloudy", temp: "29°C", wind: "22 km/h" },
    { time: "6 PM", condition: "Light Rain", temp: "27°C", wind: "25 km/h" },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Fisherfolk Dashboard</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Stay safe with real-time coastal alerts and conditions
        </p>
      </div>

      {/* Emergency Alert Banner */}
      {liveAlerts.some(alert => alert.severity === "Critical") && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">EMERGENCY ALERT</span>
          </div>
          <p className="text-red-700 text-sm mt-1">
            Critical weather conditions detected. Return to shore immediately if at sea.
          </p>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Status Cards */}
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            <Card className="text-center">
              <CardContent className="p-3">
                <div className="text-lg font-bold text-green-600">Safe</div>
                <div className="text-xs text-muted-foreground">Current Status</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3">
                <div className="text-lg font-bold">28°C</div>
                <div className="text-xs text-muted-foreground">Temperature</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3">
                <div className="text-lg font-bold">15 km/h</div>
                <div className="text-xs text-muted-foreground">Wind Speed</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3">
                <div className="text-lg font-bold text-blue-600">Good</div>
                <div className="text-xs text-muted-foreground">Visibility</div>
              </CardContent>
            </Card>
          </div>

          {/* Live Alerts Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Live Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {liveAlerts.slice(0, 2).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{alert.type}</div>
                      <div className="text-xs text-muted-foreground">{alert.location}</div>
                    </div>
                    <Badge variant={alert.severity === "Critical" ? "destructive" : alert.severity === "High" ? "default" : "secondary"} className="text-xs">
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View All Alerts
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Safety Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {safetyTips.slice(0, 3).map((tip) => (
                  <div key={tip.id} className="flex items-start gap-2 p-2 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="text-sm">{tip.tip}</div>
                      <div className="text-xs text-muted-foreground">{tip.category}</div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  More Safety Tips
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-500" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" variant="destructive">
                  <Phone className="mr-2 h-4 w-4" />
                  Coast Guard: 1554
                </Button>
                <Button className="w-full" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Weather Helpline: 1800-180-1717
                </Button>
                <Button className="w-full" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Local Fisheries: 1800-425-1555
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Active Alerts</CardTitle>
              <CardDescription>Real-time coastal threat notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{alert.type}</div>
                        <div className="text-sm text-muted-foreground">{alert.location} • {alert.time}</div>
                      </div>
                      <Badge variant={alert.severity === "Critical" ? "destructive" : alert.severity === "High" ? "default" : "secondary"}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                      <div className="text-sm font-medium text-blue-800">Action Required:</div>
                      <div className="text-sm text-blue-700">{alert.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4">
          {/* Weather Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>Weather Forecast</CardTitle>
              <CardDescription>Next 6 hours weather conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {weatherForecast.map((forecast, index) => (
                  <div key={index} className="text-center p-2 border rounded">
                    <div className="text-xs font-medium">{forecast.time}</div>
                    <div className="text-lg">
                      {forecast.condition === "Sunny" && <Sun className="h-6 w-6 mx-auto text-yellow-500" />}
                      {forecast.condition === "Partly Cloudy" && <CloudRain className="h-6 w-6 mx-auto text-gray-500" />}
                      {forecast.condition === "Cloudy" && <CloudRain className="h-6 w-6 mx-auto text-gray-600" />}
                      {forecast.condition === "Light Rain" && <CloudRain className="h-6 w-6 mx-auto text-blue-500" />}
                    </div>
                    <div className="text-sm font-medium">{forecast.temp}</div>
                    <div className="text-xs text-muted-foreground">{forecast.wind}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coastal Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Coastal Conditions</CardTitle>
              <CardDescription>Current sea conditions by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {coastalConditions.map((condition, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{condition.location}</h3>
                      <Badge variant={condition.fishing === "Safe" ? "default" : "secondary"}>
                        {condition.fishing}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Sea Level:</span> {condition.seaLevel}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Wind:</span> {condition.windSpeed}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Visibility:</span> {condition.visibility}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fishing:</span> {condition.fishing}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Map Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Coastal Map</CardTitle>
              <CardDescription>Current fishing zones and conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Interactive map would be displayed here</p>
                  <p className="text-sm">Showing nearby coastal conditions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
