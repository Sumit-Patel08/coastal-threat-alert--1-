"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TreePine, TrendingUp, TrendingDown, MapPin, Calendar, BarChart3, Leaf, ExternalLink } from "lucide-react"
import { getBlueCarbonDetails, getHistoricalCarbonData, getEcosystemMapUrl, calculateCarbonTrends } from "@/lib/blue-carbon-api"

interface BlueCarbonDetailsProps {
  ecosystem: string | null
  onBack: () => void
}

export function BlueCarbonDetails({ ecosystem, onBack }: BlueCarbonDetailsProps) {
  const [data, setData] = useState<any>(null)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [timeframe, setTimeframe] = useState<"month" | "year">("month")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ecosystem) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [detailData, histData] = await Promise.all([
          getBlueCarbonDetails(ecosystem),
          getHistoricalCarbonData(ecosystem, timeframe)
        ])
        setData(detailData)
        setHistoricalData(histData)
      } catch (error) {
        console.error("Error fetching blue carbon data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [ecosystem, timeframe])

  if (!ecosystem || loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const trends = calculateCarbonTrends(data)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Protected": return "default"
      case "At Risk": return "destructive"
      case "Declining": return "destructive"
      case "Stable": return "secondary"
      default: return "secondary"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing": return <TrendingUp className="h-4 w-4 text-green-600" />
      case "decreasing": return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent": return "bg-green-500"
      case "good": return "bg-blue-500"
      case "fair": return "bg-yellow-500"
      case "poor": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getSatelliteImageUrl = (coordinates: { lat: number; lng: number }) => {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=15&size=400x300&scale=2&maptype=satellite&key=YOUR_API_KEY`
  }

  const getGoogleMapsUrl = (coordinates: { lat: number; lng: number }, name: string) => {
    return `https://www.google.com/maps/search/${encodeURIComponent(name)}/@${coordinates.lat},${coordinates.lng},15z`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blue Carbon
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TreePine className="h-6 w-6" />
            {data.ecosystem} Ecosystem
          </h1>
          <p className="text-muted-foreground">{data.area} • Carbon Stock: {data.carbonStock}</p>
        </div>
        <Badge variant={getStatusColor(data.status)} className="ml-auto">
          {data.status}
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Current Month</CardTitle>
                <CardDescription>Latest measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Carbon Sequestration</span>
                    <span>{data.currentMonth.carbonSequestration} tons/ha/month</span>
                  </div>
                  <Progress value={(data.currentMonth.carbonSequestration / 5) * 100} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Biomass</span>
                    <span>{data.currentMonth.biomass} tons/ha</span>
                  </div>
                  <Progress value={(data.currentMonth.biomass / 300) * 100} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Soil Carbon</span>
                    <span>{data.currentMonth.soilCarbon} tons/ha</span>
                  </div>
                  <Progress value={(data.currentMonth.soilCarbon / 1000) * 100} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Previous Month</CardTitle>
                <CardDescription>Comparison data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Carbon Sequestration</span>
                    <span>{data.previousMonth.carbonSequestration} tons/ha/month</span>
                  </div>
                  <Progress value={(data.previousMonth.carbonSequestration / 5) * 100} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Biomass</span>
                    <span>{data.previousMonth.biomass} tons/ha</span>
                  </div>
                  <Progress value={(data.previousMonth.biomass / 300) * 100} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Soil Carbon</span>
                    <span>{data.previousMonth.soilCarbon} tons/ha</span>
                  </div>
                  <Progress value={(data.previousMonth.soilCarbon / 1000) * 100} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Previous Year</CardTitle>
                <CardDescription>Annual comparison</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Carbon Sequestration</span>
                    <span>{data.previousYear.carbonSequestration} tons/ha/month</span>
                  </div>
                  <Progress value={(data.previousYear.carbonSequestration / 5) * 100} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Biomass</span>
                    <span>{data.previousYear.biomass} tons/ha</span>
                  </div>
                  <Progress value={(data.previousYear.biomass / 300) * 100} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Soil Carbon</span>
                    <span>{data.previousYear.soilCarbon} tons/ha</span>
                  </div>
                  <Progress value={(data.previousYear.soilCarbon / 1000) * 100} className="mt-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Ecosystem Health Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getTrendIcon(data.trends.carbonTrend)}
                    <span className="font-medium">Carbon Trend</span>
                  </div>
                  <div className="text-2xl font-bold capitalize">{data.trends.carbonTrend}</div>
                  <div className="text-sm text-gray-600">
                    {trends.monthlyChange > 0 ? '+' : ''}{trends.monthlyChange.toFixed(1)}% vs last month
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getTrendIcon(data.trends.areaTrend)}
                    <span className="font-medium">Area Trend</span>
                  </div>
                  <div className="text-2xl font-bold capitalize">{data.trends.areaTrend}</div>
                  <div className="text-sm text-gray-600">
                    {data.currentMonth.areaChange > 0 ? '+' : ''}{data.currentMonth.areaChange}% change
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`w-4 h-4 rounded-full ${data.trends.threatLevel === 'low' ? 'bg-green-500' : data.trends.threatLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                    <span className="font-medium">Threat Level</span>
                  </div>
                  <div className="text-2xl font-bold capitalize">{data.trends.threatLevel}</div>
                  <div className="text-sm text-gray-600">Current assessment</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historical Trends</CardTitle>
                  <CardDescription>Carbon sequestration over time</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={timeframe === "month" ? "default" : "outline"}
                    onClick={() => setTimeframe("month")}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    30 Days
                  </Button>
                  <Button 
                    size="sm" 
                    variant={timeframe === "year" ? "default" : "outline"}
                    onClick={() => setTimeframe("year")}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    12 Months
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-1 border-b border-l pl-8 pb-4">
                {historicalData.map((point, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(point.carbonSequestration / 5) * 200}px` }}
                      title={`${point.date}: ${point.carbonSequestration.toFixed(2)} tons/ha`}
                    />
                    {index % Math.floor(historicalData.length / 6) === 0 && (
                      <div className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-left">
                        {new Date(point.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: timeframe === "month" ? 'numeric' : undefined,
                          year: timeframe === "year" ? 'numeric' : undefined
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Annual Projection</div>
                  <div className="text-2xl font-bold">{trends.projection.toFixed(1)} tons/ha/year</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Efficiency Rate</div>
                  <div className="text-2xl font-bold">{trends.efficiency.toFixed(2)} tons/km²</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {data.locations.map((location: any, index: number) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {location.name}
                  </CardTitle>
                  <CardDescription>
                    {location.coordinates.lat.toFixed(4)}°N, {location.coordinates.lng.toFixed(4)}°E
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.coordinates.lat},${location.coordinates.lng}&zoom=15&size=400x300&scale=2&maptype=satellite`}
                    alt={`${location.name} satellite view`}
                    className="w-full h-32 object-cover rounded mb-3"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#e5e7eb"/>
                          <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="#6b7280">
                            ${location.name}
                            Satellite View
                          </text>
                        </svg>
                      `)}`
                    }}
                  />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Coverage</span>
                      <span className="text-sm font-medium">{location.coverage}%</span>
                    </div>
                    <Progress value={location.coverage} />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Health Status</span>
                      <Badge 
                        className={`${getHealthColor(location.health)} text-white`}
                      >
                        {location.health}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(getGoogleMapsUrl(location.coordinates, location.name), '_blank')}
                      >
                        <MapPin className="h-3 w-3 mr-2" />
                        View on Google Maps
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Detailed ecosystem assessment and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Key Metrics Comparison</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Monthly Change</span>
                      <span className={trends.monthlyChange >= 0 ? "text-green-600" : "text-red-600"}>
                        {trends.monthlyChange > 0 ? '+' : ''}{trends.monthlyChange.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Change</span>
                      <span className={trends.yearlyChange >= 0 ? "text-green-600" : "text-red-600"}>
                        {trends.yearlyChange > 0 ? '+' : ''}{trends.yearlyChange.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbon Efficiency</span>
                      <span>{trends.efficiency.toFixed(2)} tons/km²</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Conservation Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getHealthColor(data.status.toLowerCase())}`}></div>
                      <span>Overall Status: {data.status}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Threat Level: <span className="capitalize font-medium">{data.trends.threatLevel}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Area Trend: <span className="capitalize font-medium">{data.trends.areaTrend}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Conservation Recommendations</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {data.status === "Protected" && (
                    <>
                      <li>• Continue current protection measures</li>
                      <li>• Monitor for invasive species</li>
                      <li>• Expand protected area boundaries</li>
                    </>
                  )}
                  {data.status === "At Risk" && (
                    <>
                      <li>• Implement immediate protection measures</li>
                      <li>• Reduce human disturbance</li>
                      <li>• Establish buffer zones</li>
                    </>
                  )}
                  {data.status === "Declining" && (
                    <>
                      <li>• Emergency intervention required</li>
                      <li>• Restore degraded areas</li>
                      <li>• Address pollution sources</li>
                    </>
                  )}
                  {data.status === "Stable" && (
                    <>
                      <li>• Maintain current management practices</li>
                      <li>• Regular monitoring protocols</li>
                      <li>• Community engagement programs</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
