"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Satellite, ZoomIn, ZoomOut, RotateCcw, MapPin, Waves, TrendingUp, AlertTriangle } from "lucide-react"
import { COASTAL_REGIONS, getRegionalAnalysis, generateSatelliteMapUrl, getTideData, getGoogleEarthSatelliteUrl, getGoogleEarthHybridUrl } from "@/lib/satellite-api"

interface RegionAnalysis {
  region: string
  coordinates: { lat: number; lng: number }
  floodRisk: "High" | "Medium" | "Low"
  tideLevel: "High Tide" | "Low Tide" | "Normal"
  waterLevel: number
  elevation: number
  vegetation: number
  urbanDensity: number
  riskFactors: string[]
}

export function EnhancedSatelliteViewer() {
  const [selectedRegion, setSelectedRegion] = useState<"mumbai" | "chennai">("mumbai")
  const [zoomLevel, setZoomLevel] = useState(14)
  const [viewMode, setViewMode] = useState<"satellite" | "hybrid">("satellite")
  const [regionalData, setRegionalData] = useState<RegionAnalysis[]>([])
  const [tideData, setTideData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [analysisData, tideInfo] = await Promise.all([
          getRegionalAnalysis(selectedRegion),
          getTideData(selectedRegion)
        ])
        
        setRegionalData(analysisData)
        setTideData(tideInfo)
        setLastUpdated(new Date())
      } catch (error) {
        console.error("Error fetching satellite data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedRegion])

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 2, 20))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 2, 8))
  }

  const handleReset = () => {
    setZoomLevel(14)
  }

  const getSatelliteImageUrl = () => {
    if (viewMode === "hybrid") {
      return getGoogleEarthHybridUrl(selectedRegion, zoomLevel, 800, 600)
    }
    return getGoogleEarthSatelliteUrl(selectedRegion, zoomLevel, 800, 600)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-red-500"
      case "Medium": return "bg-yellow-500"
      case "Low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getTideColor = (tide: string) => {
    switch (tide) {
      case "High Tide": return "text-blue-600"
      case "Low Tide": return "text-orange-600"
      case "Normal": return "text-gray-600"
      default: return "text-gray-600"
    }
  }

  const currentTide = tideData.find(t => {
    const tideHour = new Date(t.time).getHours()
    const currentHour = new Date().getHours()
    return Math.abs(tideHour - currentHour) <= 1
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Satellite className="h-5 w-5" />
              Enhanced Satellite Imagery
            </CardTitle>
            <CardDescription>Loading real-time coastal satellite data...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5" />
            Enhanced Satellite Imagery
          </CardTitle>
          <CardDescription>
            Real-time NASA satellite imagery with flood risk analysis
          </CardDescription>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            {currentTide && (
              <span className={`font-medium ${getTideColor(currentTide.type)}`}>
                Current: {currentTide.type} Tide ({currentTide.level.toFixed(1)}m)
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as "mumbai" | "chennai")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mumbai">Mumbai Coast</TabsTrigger>
              <TabsTrigger value="chennai">Chennai Coast</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedRegion} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Satellite Image Viewer */}
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {COASTAL_REGIONS[selectedRegion].name} - Google Earth Satellite
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant={viewMode === "satellite" ? "default" : "outline"} 
                            onClick={() => setViewMode("satellite")}
                          >
                            Satellite
                          </Button>
                          <Button 
                            size="sm" 
                            variant={viewMode === "hybrid" ? "default" : "outline"} 
                            onClick={() => setViewMode("hybrid")}
                          >
                            Hybrid
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleZoomOut}>
                            <ZoomOut className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleZoomIn}>
                            <ZoomIn className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleReset}>
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Zoom Level: {zoomLevel} | Mode: {viewMode} | Source: Google Earth
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <img
                          src={getSatelliteImageUrl()}
                          alt={`${COASTAL_REGIONS[selectedRegion].name} Google Earth Satellite View`}
                          className="w-full h-96 object-cover border rounded-lg"
                          onError={(e) => {
                            // Fallback to a placeholder if Google API fails
                            e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                              <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100%" height="100%" fill="#e5e7eb"/>
                                <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="#6b7280">
                                  Google Earth Satellite Image
                                  ${COASTAL_REGIONS[selectedRegion].name}
                                  Zoom: ${zoomLevel}
                                </text>
                              </svg>
                            `)}`
                          }}
                        />
                        
                        {/* Overlay with flood risk zones */}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                          <div className="font-semibold mb-1">Flood Risk Zones</div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded"></div>
                              <span>High Risk</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                              <span>Medium Risk</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded"></div>
                              <span>Low Risk</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Region Analysis Grid */}
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {regionalData.map((region, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded border-2 ${getRiskColor(region.floodRisk)} bg-opacity-20 border-opacity-50`}
                          >
                            <div className="text-xs font-medium">{region.region}</div>
                            <div className="text-xs text-gray-600">
                              Risk: {region.floodRisk} | {region.tideLevel}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Current Conditions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">High Risk Zones</span>
                        <Badge variant="destructive">
                          {regionalData.filter(r => r.floodRisk === "High").length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Medium Risk Zones</span>
                        <Badge variant="default">
                          {regionalData.filter(r => r.floodRisk === "Medium").length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Water Level</span>
                        <span className="text-sm font-medium">
                          {(regionalData.reduce((sum, r) => sum + r.waterLevel, 0) / regionalData.length).toFixed(1)}m
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Urban Density</span>
                        <span className="text-sm font-medium">
                          {Math.round(regionalData.reduce((sum, r) => sum + r.urbanDensity, 0) / regionalData.length)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Waves className="h-4 w-4" />
                        Tide Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {currentTide && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Current Level</span>
                            <span className={`text-sm font-medium ${getTideColor(currentTide.type)}`}>
                              {currentTide.level.toFixed(1)}m
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Status</span>
                            <span className={`text-sm font-medium ${getTideColor(currentTide.type)}`}>
                              {currentTide.type}
                            </span>
                          </div>
                          <div className="mt-3">
                            <div className="text-xs text-gray-600 mb-1">24h Tide Pattern</div>
                            <div className="h-16 flex items-end gap-1">
                              {tideData.slice(0, 12).map((tide, i) => (
                                <div
                                  key={i}
                                  className="flex-1 bg-blue-200 rounded-t"
                                  style={{ height: `${(tide.level / 6) * 100}%` }}
                                  title={`${new Date(tide.time).getHours()}:00 - ${tide.level.toFixed(1)}m`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Detailed Regional Analysis Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Regional Analysis Data
                  </CardTitle>
                  <CardDescription>
                    Detailed flood risk assessment by zone with tide and elevation data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Zone</TableHead>
                        <TableHead>Coordinates</TableHead>
                        <TableHead>Flood Risk</TableHead>
                        <TableHead>Tide Level</TableHead>
                        <TableHead>Water Level (m)</TableHead>
                        <TableHead>Elevation (m)</TableHead>
                        <TableHead>Vegetation (%)</TableHead>
                        <TableHead>Urban Density (%)</TableHead>
                        <TableHead>Risk Factors</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regionalData.map((region, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{region.region}</TableCell>
                          <TableCell className="text-xs">
                            {region.coordinates.lat.toFixed(3)}, {region.coordinates.lng.toFixed(3)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={region.floodRisk === "High" ? "destructive" : 
                                      region.floodRisk === "Medium" ? "default" : "secondary"}
                            >
                              {region.floodRisk}
                            </Badge>
                          </TableCell>
                          <TableCell className={getTideColor(region.tideLevel)}>
                            {region.tideLevel}
                          </TableCell>
                          <TableCell>{region.waterLevel}</TableCell>
                          <TableCell>{region.elevation}</TableCell>
                          <TableCell>{region.vegetation}%</TableCell>
                          <TableCell>{region.urbanDensity}%</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {region.riskFactors.slice(0, 2).map((factor, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {factor}
                                </Badge>
                              ))}
                              {region.riskFactors.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{region.riskFactors.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Alert Summary */}
              {regionalData.some(r => r.floodRisk === "High") && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">High Risk Areas Detected</span>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      {regionalData.filter(r => r.floodRisk === "High").length} zones are at high flood risk. 
                      Monitor tide levels and consider evacuation protocols for affected areas.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
