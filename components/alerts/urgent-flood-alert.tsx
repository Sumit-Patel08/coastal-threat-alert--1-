"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Waves, Phone, MapPin, Clock, Users, ExternalLink, MessageSquare, Send } from "lucide-react"
import { SMSService } from "@/lib/sms-service"

interface FloodAlert {
  id: string
  location: string
  severity: "Critical" | "High" | "Medium" | "Low"
  type: "Coastal Flooding" | "River Overflow" | "Storm Surge" | "Flash Flood"
  affectedArea: string
  peopleAtRisk: number
  timestamp: string
  coordinates: { lat: number; lng: number }
  waterLevel: number
  evacuationStatus: "Required" | "Recommended" | "Monitor" | "None"
}

export function UrgentFloodAlert() {
  const [floodAlerts, setFloodAlerts] = useState<FloodAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [sendingAlert, setSendingAlert] = useState<string | null>(null)
  const [smsResults, setSmsResults] = useState<{[key: string]: any}>({})
  const smsService = SMSService.getInstance()

  // Simulate real-time flood data fetching
  useEffect(() => {
    const fetchFloodData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock flood alerts for coastal areas in the past 2 days
        const mockAlerts: FloodAlert[] = [
          {
            id: "FL001",
            location: "Mumbai Coastal Area",
            severity: "Critical",
            type: "Storm Surge",
            affectedArea: "25 km²",
            peopleAtRisk: 15000,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            coordinates: { lat: 19.0760, lng: 72.8777 },
            waterLevel: 3.2,
            evacuationStatus: "Required"
          },
          {
            id: "FL002",
            location: "Chennai Marina Beach",
            severity: "High",
            type: "Coastal Flooding",
            affectedArea: "12 km²",
            peopleAtRisk: 8500,
            timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
            coordinates: { lat: 13.0827, lng: 80.2707 },
            waterLevel: 2.1,
            evacuationStatus: "Recommended"
          },
          {
            id: "FL003",
            location: "Kochi Backwaters",
            severity: "Medium",
            type: "River Overflow",
            affectedArea: "8 km²",
            peopleAtRisk: 3200,
            timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 30 hours ago
            coordinates: { lat: 9.9312, lng: 76.2673 },
            waterLevel: 1.8,
            evacuationStatus: "Monitor"
          }
        ]
        
        setFloodAlerts(mockAlerts)
        setLastUpdated(new Date())
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch flood data:", error)
        setLoading(false)
      }
    }

    fetchFloodData()
    
    // Update every 5 minutes
    const interval = setInterval(fetchFloodData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive"
      case "High": return "destructive"
      case "Medium": return "default"
      case "Low": return "secondary"
      default: return "secondary"
    }
  }

  const getEvacuationColor = (status: string) => {
    switch (status) {
      case "Required": return "text-red-600"
      case "Recommended": return "text-orange-600"
      case "Monitor": return "text-yellow-600"
      default: return "text-gray-600"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours === 1) return "1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`
  }

  const getSatelliteImage = (location: string, coordinates: { lat: number; lng: number }) => {
    switch (location) {
      case "Mumbai Coastal Area":
        return "/mumbai-coastal-satellite.png"
      case "Chennai Marina Beach":
        return "/chennai-marina-beach-satellite.png"
      case "Kochi Backwaters":
        return "/kochi-backwaters-satellite.png"
      default:
        return `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=14&size=600x300&scale=2&maptype=satellite&format=jpg`
    }
  }

  const getGoogleMapsUrl = (coordinates: { lat: number; lng: number }, location: string) => {
    return `https://www.google.com/maps/search/${encodeURIComponent(location)}/@${coordinates.lat},${coordinates.lng},15z`
  }

  const handleSendSMS = async (alert: FloodAlert) => {
    setSendingAlert(alert.id)
    
    try {
      const result = await smsService.sendFloodAlert(
        alert.location,
        alert.severity,
        alert.waterLevel,
        alert.evacuationStatus
      )
      
      setSmsResults(prev => ({
        ...prev,
        [alert.id]: result
      }))
      
      // Show success/error feedback
      if (result.success) {
        console.log(`SMS alerts sent successfully to ${result.sent} contacts`)
      } else {
        console.error(`Failed to send ${result.failed} SMS alerts:`, result.errors)
      }
      
    } catch (error) {
      console.error("Error sending SMS alerts:", error)
      setSmsResults(prev => ({
        ...prev,
        [alert.id]: { success: false, sent: 0, failed: 1, errors: [String(error)] }
      }))
    } finally {
      setSendingAlert(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-blue-600" />
            Urgent Security Alerts
          </CardTitle>
          <CardDescription>Loading real-time flood data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          Urgent Security Alerts
        </CardTitle>
        <CardDescription className="text-red-700">
          Recent flood incidents in coastal areas requiring immediate attention
        </CardDescription>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="h-3 w-3" />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {floodAlerts.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Waves className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No urgent flood alerts in the past 2 days</p>
            <p className="text-xs">Monitoring coastal areas...</p>
          </div>
        ) : (
          floodAlerts.map((alert) => (
            <div key={alert.id} className="border border-red-200 rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${alert.severity === 'Critical' ? 'text-red-600' : 'text-orange-600'}`} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{alert.type}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </div>
                  </div>
                </div>
                <Badge variant={getSeverityColor(alert.severity)}>
                  {alert.severity}
                </Badge>
              </div>

              <div className="mb-3">
                <img
                  src={getSatelliteImage(alert.location, alert.coordinates)}
                  alt={`${alert.location} satellite view`}
                  className="w-full h-32 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#e5e7eb"/>
                        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="#6b7280">
                          ${alert.location} Satellite View
                        </text>
                      </svg>
                    `)}`
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="font-medium">Affected Area:</span> {alert.affectedArea}
                </div>
                <div>
                  <span className="font-medium">Water Level:</span> {alert.waterLevel}m
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span className="font-medium">People at Risk:</span> {alert.peopleAtRisk.toLocaleString()}
                </div>
                <div className={`font-medium ${getEvacuationColor(alert.evacuationStatus)}`}>
                  Evacuation: {alert.evacuationStatus}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(alert.timestamp)}
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => window.open(getGoogleMapsUrl(alert.coordinates, alert.location), '_blank')}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    View Location
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="text-xs bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSendSMS(alert)}
                    disabled={sendingAlert === alert.id}
                  >
                    {sendingAlert === alert.id ? (
                      <>
                        <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-3 w-3 mr-1" />
                        Send SMS Alert
                      </>
                    )}
                  </Button>
                  <Button size="sm" className="text-xs bg-red-600 hover:bg-red-700">
                    <Phone className="h-3 w-3 mr-1" />
                    Emergency Response
                  </Button>
                </div>
              </div>
              
              {/* SMS Status Display */}
              {smsResults[alert.id] && (
                <div className={`mt-3 p-2 rounded text-xs ${
                  smsResults[alert.id].success 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {smsResults[alert.id].success 
                      ? `✅ SMS sent to ${smsResults[alert.id].sent} contacts`
                      : `❌ Failed to send ${smsResults[alert.id].failed} SMS alerts`
                    }
                  </div>
                  {smsResults[alert.id].errors?.length > 0 && (
                    <div className="mt-1 text-xs opacity-75">
                      {smsResults[alert.id].errors[0]}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        
        {floodAlerts.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Emergency Protocols Active</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Coordinate with local authorities and follow evacuation guidelines for affected areas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
