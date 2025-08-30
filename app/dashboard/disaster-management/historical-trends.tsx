"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, BarChart3, Activity, Waves, Cloud, Zap } from "lucide-react"
import Image from "next/image"

export function HistoricalTrendsTab({ selectedCity }: { selectedCity: string }) {
  // Generate city-specific trend data
  const getCitySpecificTrends = (city: string) => {
    const cityTrends: Record<string, any> = {
      'Mumbai': {
        '7': { seaLevel: "+2.4m", storms: "4 systems", pollution: "125 AQI", trend: "increasing" },
        '30': { seaLevel: "+2.1m", storms: "15 systems", pollution: "118 AQI", trend: "increasing" },
        '90': { seaLevel: "+1.8m", storms: "32 systems", pollution: "105 AQI", trend: "stable" }
      },
      'Chennai': {
        '7': { seaLevel: "+1.8m", storms: "6 systems", pollution: "95 AQI", trend: "increasing" },
        '30': { seaLevel: "+1.5m", storms: "18 systems", pollution: "88 AQI", trend: "stable" },
        '90': { seaLevel: "+1.2m", storms: "45 systems", pollution: "82 AQI", trend: "decreasing" }
      },
      'Kolkata': {
        '7': { seaLevel: "+1.5m", storms: "2 systems", pollution: "135 AQI", trend: "stable" },
        '30': { seaLevel: "+1.3m", storms: "8 systems", pollution: "128 AQI", trend: "stable" },
        '90': { seaLevel: "+1.0m", storms: "22 systems", pollution: "115 AQI", trend: "decreasing" }
      },
      'Kochi': {
        '7': { seaLevel: "+1.2m", storms: "3 systems", pollution: "85 AQI", trend: "stable" },
        '30': { seaLevel: "+1.0m", storms: "12 systems", pollution: "78 AQI", trend: "stable" },
        '90': { seaLevel: "+0.8m", storms: "28 systems", pollution: "72 AQI", trend: "decreasing" }
      },
      'Goa': {
        '7': { seaLevel: "+0.9m", storms: "1 system", pollution: "65 AQI", trend: "stable" },
        '30': { seaLevel: "+0.7m", storms: "6 systems", pollution: "58 AQI", trend: "stable" },
        '90': { seaLevel: "+0.5m", storms: "18 systems", pollution: "52 AQI", trend: "decreasing" }
      },
      'Visakhapatnam': {
        '7': { seaLevel: "+1.6m", storms: "3 systems", pollution: "92 AQI", trend: "increasing" },
        '30': { seaLevel: "+1.4m", storms: "14 systems", pollution: "85 AQI", trend: "stable" },
        '90': { seaLevel: "+1.1m", storms: "35 systems", pollution: "78 AQI", trend: "decreasing" }
      },
      'Surat': {
        '7': { seaLevel: "+1.9m", storms: "2 systems", pollution: "142 AQI", trend: "increasing" },
        '30': { seaLevel: "+1.7m", storms: "9 systems", pollution: "135 AQI", trend: "stable" },
        '90': { seaLevel: "+1.4m", storms: "25 systems", pollution: "128 AQI", trend: "decreasing" }
      },
      'Mangalore': {
        '7': { seaLevel: "+1.3m", storms: "2 systems", pollution: "78 AQI", trend: "stable" },
        '30': { seaLevel: "+1.1m", storms: "10 systems", pollution: "72 AQI", trend: "stable" },
        '90': { seaLevel: "+0.9m", storms: "26 systems", pollution: "68 AQI", trend: "decreasing" }
      },
      'Puducherry': {
        '7': { seaLevel: "+1.1m", storms: "2 systems", pollution: "72 AQI", trend: "stable" },
        '30': { seaLevel: "+0.9m", storms: "8 systems", pollution: "68 AQI", trend: "stable" },
        '90': { seaLevel: "+0.7m", storms: "22 systems", pollution: "62 AQI", trend: "decreasing" }
      },
      'Thiruvananthapuram': {
        '7': { seaLevel: "+0.8m", storms: "1 system", pollution: "58 AQI", trend: "stable" },
        '30': { seaLevel: "+0.6m", storms: "6 systems", pollution: "52 AQI", trend: "stable" },
        '90': { seaLevel: "+0.4m", storms: "18 systems", pollution: "48 AQI", trend: "decreasing" }
      },
      'Bhubaneswar': {
        '7': { seaLevel: "+1.4m", storms: "3 systems", pollution: "88 AQI", trend: "stable" },
        '30': { seaLevel: "+1.2m", storms: "12 systems", pollution: "82 AQI", trend: "stable" },
        '90': { seaLevel: "+1.0m", storms: "30 systems", pollution: "75 AQI", trend: "decreasing" }
      },
      'Porbandar': {
        '7': { seaLevel: "+0.7m", storms: "1 system", pollution: "52 AQI", trend: "stable" },
        '30': { seaLevel: "+0.5m", storms: "5 systems", pollution: "48 AQI", trend: "stable" },
        '90': { seaLevel: "+0.3m", storms: "15 systems", pollution: "42 AQI", trend: "decreasing" }
      },
      'Dwarka': {
        '7': { seaLevel: "+0.6m", storms: "1 system", pollution: "48 AQI", trend: "stable" },
        '30': { seaLevel: "+0.4m", storms: "4 systems", pollution: "45 AQI", trend: "stable" },
        '90': { seaLevel: "+0.2m", storms: "12 systems", pollution: "40 AQI", trend: "decreasing" }
      },
      'Okha': {
        '7': { seaLevel: "+0.8m", storms: "1 system", pollution: "55 AQI", trend: "stable" },
        '30': { seaLevel: "+0.6m", storms: "6 systems", pollution: "50 AQI", trend: "stable" },
        '90': { seaLevel: "+0.4m", storms: "18 systems", pollution: "45 AQI", trend: "decreasing" }
      }
    }
    
    return cityTrends[city] || cityTrends['Mumbai']
  }

  const cityTrends = getCitySpecificTrends(selectedCity)
  
  const trendData = [
    {
      period: "Last 7 Days",
      ...cityTrends['7']
    },
    {
      period: "Last 30 Days", 
      ...cityTrends['30']
    },
    {
      period: "Last 90 Days",
      ...cityTrends['90']
    }
  ]

  const satelliteImages = [
    {
      title: "Current Cyclone Formation",
      description: `${selectedCity} coastal region - Active storm system`,
      timestamp: "2 hours ago"
    },
    {
      title: "Coastal Erosion Analysis", 
      description: `${selectedCity} coastline changes`,
      timestamp: "6 hours ago"
    },
    {
      title: "Pollution Spread Pattern",
      description: `${selectedCity} industrial discharge tracking`,
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
            <CardDescription>Historical threat pattern analysis for {selectedCity}</CardDescription>
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
              Satellite Data
            </CardTitle>
            <CardDescription>Recent satellite analysis and monitoring for {selectedCity}</CardDescription>
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
          <CardDescription>AI-powered threat forecasting and risk modeling for {selectedCity}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {selectedCity === 'Mumbai' ? '78%' : selectedCity === 'Chennai' ? '65%' : selectedCity === 'Kolkata' ? '72%' : selectedCity === 'Kochi' ? '58%' : selectedCity === 'Goa' ? '45%' : selectedCity === 'Visakhapatnam' ? '68%' : selectedCity === 'Surat' ? '82%' : selectedCity === 'Mangalore' ? '55%' : selectedCity === 'Puducherry' ? '52%' : selectedCity === 'Thiruvananthapuram' ? '48%' : selectedCity === 'Bhubaneswar' ? '62%' : selectedCity === 'Porbandar' ? '42%' : selectedCity === 'Dwarka' ? '38%' : selectedCity === 'Okha' ? '45%' : '72%'}
                </div>
                <div className="text-sm font-medium mb-1">Flood Risk</div>
                <div className="text-xs text-muted-foreground">Next 48 hours</div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-red-50">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {selectedCity === 'Mumbai' ? '52%' : selectedCity === 'Chennai' ? '78%' : selectedCity === 'Kolkata' ? '45%' : selectedCity === 'Kochi' ? '62%' : selectedCity === 'Goa' ? '38%' : selectedCity === 'Visakhapatnam' ? '58%' : selectedCity === 'Surat' ? '48%' : selectedCity === 'Mangalore' ? '55%' : selectedCity === 'Puducherry' ? '42%' : selectedCity === 'Thiruvananthapuram' ? '35%' : selectedCity === 'Bhubaneswar' ? '52%' : selectedCity === 'Porbandar' ? '28%' : selectedCity === 'Dwarka' ? '25%' : selectedCity === 'Okha' ? '32%' : '45%'}
                </div>
                <div className="text-sm font-medium mb-1">Storm Formation</div>
                <div className="text-xs text-muted-foreground">Next 7 days</div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {selectedCity === 'Mumbai' ? '35%' : selectedCity === 'Chennai' ? '28%' : selectedCity === 'Kolkata' ? '42%' : selectedCity === 'Kochi' ? '25%' : selectedCity === 'Goa' ? '18%' : selectedCity === 'Visakhapatnam' ? '32%' : selectedCity === 'Surat' ? '45%' : selectedCity === 'Mangalore' ? '22%' : selectedCity === 'Puducherry' ? '20%' : selectedCity === 'Thiruvananthapuram' ? '15%' : selectedCity === 'Bhubaneswar' ? '28%' : selectedCity === 'Porbandar' ? '12%' : selectedCity === 'Dwarka' ? '10%' : selectedCity === 'Okha' ? '15%' : '28%'}
                </div>
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
