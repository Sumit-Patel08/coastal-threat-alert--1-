"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Brain, Clock, MapPin, Zap, RefreshCw, Activity } from "lucide-react"
import { AIAlert, getAIAlertsForCity, getAvailableCities, getAISeverityColor } from "@/lib/mock-data"

export function AIAlertLogs() {
  const [selectedCity, setSelectedCity] = useState<string>("Mumbai")
  const [alerts, setAlerts] = useState<AIAlert[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastScan, setLastScan] = useState<string>("")

  const availableCities = getAvailableCities()

  useEffect(() => {
    loadAlertsForCity(selectedCity)
  }, [selectedCity])

  useEffect(() => {
    // Update last scan time every minute
    const updateTime = () => {
      const now = new Date()
      setLastScan(now.toLocaleTimeString())
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadAlertsForCity = (city: string) => {
    const cityAlerts = getAIAlertsForCity(city)
    setAlerts(cityAlerts)
  }

  const runAIAnalysis = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Refresh alerts for current city
    loadAlertsForCity(selectedCity)
    setLastScan(new Date().toLocaleTimeString())
    setIsAnalyzing(false)
  }

  const getSeverityIcon = (severity: AIAlert["severity"]) => {
    switch (severity) {
      case "Critical":
        return "🔴"
      case "High":
        return "🟠"
      case "Medium":
        return "🟡"
      case "Low":
        return "🟢"
      default:
        return "⚪"
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">
              AI Alert Logs
            </h2>
            <p className="text-muted-foreground">
              Real-time alerts for {selectedCity} • Last scan: {lastScan}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {city}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={runAIAnalysis} 
            disabled={isAnalyzing}
            className="gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Run AI Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-purple-600 animate-pulse" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-800">
                    AI Analysis in Progress for {selectedCity}
                  </span>
                  <span className="text-sm text-purple-600">Processing...</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert Cards */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No AI alerts for {selectedCity}
              </h3>
              <p className="text-muted-foreground">
                Run AI analysis to detect potential threats and anomalies
              </p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getSeverityIcon(alert.severity)}</div>
                    <div>
                      <h3 className="text-lg font-semibold">{alert.type}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge className={getAISeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span>•</span>
                        <span>{alert.source}</span>
                        <span>•</span>
                        <span>{alert.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">
                      Confidence: {alert.confidence}%
                    </div>
                    <Progress value={alert.confidence} className="h-2 w-20" />
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {alert.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>AI Detected • {alert.detectedAt}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      <span>{alert.autoGenerated ? "Auto" : "Manual"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      AI Generated
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Statistics */}
      {alerts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Critical Alerts</p>
                  <p className="text-2xl font-bold text-red-800">
                    {alerts.filter(a => a.severity === "Critical").length}
                  </p>
                </div>
                <div className="text-2xl">🔴</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">High Priority</p>
                  <p className="text-2xl font-bold text-orange-800">
                    {alerts.filter(a => a.severity === "High").length}
                  </p>
                </div>
                <div className="text-2xl">🟠</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Confidence</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {Math.round(alerts.reduce((sum, alert) => sum + alert.confidence, 0) / alerts.length)}%
                  </p>
                </div>
                <div className="text-2xl">🧠</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
