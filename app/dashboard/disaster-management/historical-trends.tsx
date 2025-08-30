"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, BarChart3, Activity, Waves, Cloud, Zap } from "lucide-react"
import Image from "next/image"

export function HistoricalTrendsTab() {
  const trendData = [
    {
      period: "Last 7 Days",
      seaLevel: "+2.1m",
      storms: "3 systems",
      pollution: "118 AQI",
      trend: "increasing"
    },
    {
      period: "Last 30 Days", 
      seaLevel: "+1.8m",
      storms: "12 systems",
      pollution: "105 AQI",
      trend: "stable"
    },
    {
      period: "Last 90 Days",
      seaLevel: "+1.5m", 
      storms: "28 systems",
      pollution: "98 AQI",
      trend: "decreasing"
    }
  ]

  const satelliteImages = [
    {
      title: "Current Cyclone Formation",
      description: "Bay of Bengal - Active storm system",
      timestamp: "2 hours ago"
    },
    {
      title: "Coastal Erosion Analysis", 
      description: "Mumbai coastline changes",
      timestamp: "6 hours ago"
    },
    {
      title: "Pollution Spread Pattern",
      description: "Industrial discharge tracking",
      timestamp: "12 hours ago"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Trend Analysis
            </CardTitle>
            <CardDescription>Historical threat pattern analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendData.map((data, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{data.period}</span>
                    <Badge variant={data.trend === 'increasing' ? 'destructive' : data.trend === 'stable' ? 'secondary' : 'outline'}>
                      {data.trend}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Waves className="h-3 w-3 text-blue-500" />
                      <span>{data.seaLevel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Cloud className="h-3 w-3 text-gray-500" />
                      <span>{data.storms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-red-500" />
                      <span>{data.pollution}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Satellite Imagery
            </CardTitle>
            <CardDescription>Recent satellite analysis and monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {satelliteImages.map((image, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{image.title}</div>
                      <div className="text-xs text-muted-foreground mb-1">{image.description}</div>
                      <div className="text-xs text-blue-600">{image.timestamp}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Predictive Analytics
          </CardTitle>
          <CardDescription>AI-powered threat forecasting and risk modeling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">72%</div>
                <div className="text-sm font-medium mb-1">Flood Risk</div>
                <div className="text-xs text-muted-foreground">Next 48 hours</div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-red-50">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">45%</div>
                <div className="text-sm font-medium mb-1">Storm Formation</div>
                <div className="text-xs text-muted-foreground">Next 7 days</div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">28%</div>
                <div className="text-sm font-medium mb-1">Evacuation Need</div>
                <div className="text-xs text-muted-foreground">Risk assessment</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
