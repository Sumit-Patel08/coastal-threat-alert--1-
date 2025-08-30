"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AlertTriangle, MapPin, Clock, ChevronDown, ChevronUp, ExternalLink, Navigation, Zap } from "lucide-react"
import { useGeolocation } from "@/lib/geolocation"
import { useRealTimeData, type RealTimeAlert } from "@/lib/realtime-data"
import { getSeverityColor, getSeverityBadgeVariant } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface RealTimeAlertsProps {
  title?: string
  maxItems?: number
  showViewAll?: boolean
}

export function RealTimeAlerts({ 
  title = "Live Alerts", 
  maxItems = 3, 
  showViewAll = true 
}: RealTimeAlertsProps) {
  const { location: userLocation, loading: locationLoading } = useGeolocation()
  const { data: realTimeData, lastUpdate, isConnected } = useRealTimeData()
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<RealTimeAlert | null>(null)

  const alerts: RealTimeAlert[] = realTimeData?.alerts || []
  const displayAlerts = maxItems ? alerts.slice(0, maxItems) : alerts
  const nearbyAlerts = alerts.filter(alert => alert.isNearby)

  const toggleExpand = (alertId: string) => {
    setExpandedAlert(expandedAlert === alertId ? null : alertId)
  }

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return ''
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`
    }
    return `${distance.toFixed(1)}km away`
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {title}
            {isConnected && (
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 font-normal">LIVE</span>
              </div>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {userLocation && (
              <Badge variant="outline" className="text-xs">
                <Navigation className="h-3 w-3 mr-1" />
                Location Active
              </Badge>
            )}
            {lastUpdate && (
              <span className="text-xs text-muted-foreground">
                {new Date(lastUpdate).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        
        {nearbyAlerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
            <div className="flex items-center gap-2 text-amber-800 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">
                {nearbyAlerts.length} alert{nearbyAlerts.length !== 1 ? 's' : ''} near your location
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayAlerts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              {isConnected ? 'No active alerts in your area' : 'Connecting to alert system...'}
            </div>
          ) : (
            displayAlerts.map((alert) => (
              <div key={alert.id}>
                <Collapsible
                  open={expandedAlert === alert.id}
                  onOpenChange={() => toggleExpand(alert.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div className={cn(
                      "w-full p-3 border rounded-lg cursor-pointer card-hover animate-fade-in",
                      getSeverityColor(alert.severity),
                      expandedAlert === alert.id && "ring-2 ring-blue-200",
                      alert.severity === "critical" && "animate-pulse-critical",
                      alert.isNearby && "ring-2 ring-amber-300"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={getSeverityBadgeVariant(alert.severity)} className="text-xs">
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", getUrgencyColor(alert.urgencyLevel))}
                            >
                              {alert.urgencyLevel.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {alert.status === "active" ? "🔴 Active" : alert.status === "monitoring" ? "🟡 Monitoring" : "🟢 Resolved"}
                            </span>
                            {alert.isNearby && (
                              <Badge variant="destructive" className="text-xs animate-pulse">
                                NEARBY
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium text-sm mb-1">{alert.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(alert.timeIssued)}
                            </div>
                            {alert.distance && (
                              <div className="text-blue-600 font-medium">
                                {formatDistance(alert.distance)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {expandedAlert === alert.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-2 animate-slide-down">
                    <div className="pl-3 pr-3 pb-3 space-y-3">
                      <div className="text-sm text-muted-foreground">
                        {alert.description}
                      </div>
                      
                      <div className={cn(
                        "p-3 rounded border-l-4",
                        alert.urgencyLevel === 'immediate' ? 'bg-red-50 border-red-400' :
                        alert.urgencyLevel === 'high' ? 'bg-orange-50 border-orange-400' :
                        'bg-blue-50 border-blue-400'
                      )}>
                        <div className={cn(
                          "text-sm font-medium mb-2",
                          alert.urgencyLevel === 'immediate' ? 'text-red-800' :
                          alert.urgencyLevel === 'high' ? 'text-orange-800' :
                          'text-blue-800'
                        )}>
                          {alert.urgencyLevel === 'immediate' ? '🚨 IMMEDIATE ACTION REQUIRED:' :
                           alert.urgencyLevel === 'high' ? '⚠️ HIGH PRIORITY ACTIONS:' :
                           '📋 RECOMMENDED ACTIONS:'}
                        </div>
                        <div className="space-y-1">
                          {alert.safetyActions.slice(0, 3).map((action, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <span className={cn(
                                "text-white text-xs rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5",
                                alert.urgencyLevel === 'immediate' ? 'bg-red-500' :
                                alert.urgencyLevel === 'high' ? 'bg-orange-500' :
                                'bg-blue-500'
                              )}>
                                {index + 1}
                              </span>
                              <span className={cn(
                                "text-sm",
                                alert.urgencyLevel === 'immediate' ? 'text-red-700' :
                                alert.urgencyLevel === 'high' ? 'text-orange-700' :
                                'text-blue-700'
                              )}>{action}</span>
                            </div>
                          ))}
                          {alert.safetyActions.length > 3 && (
                            <div className={cn(
                              "text-xs mt-1",
                              alert.urgencyLevel === 'immediate' ? 'text-red-600' :
                              alert.urgencyLevel === 'high' ? 'text-orange-600' :
                              'text-blue-600'
                            )}>
                              +{alert.safetyActions.length - 3} more actions available
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last updated: {formatTime(alert.lastUpdate)}</span>
                        <span className="capitalize">{alert.category} alert</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))
          )}
          
          {showViewAll && alerts.length > 0 && (
            <Button variant="outline" size="sm" className="w-full mt-3" asChild>
              <a href="/dashboard/alerts/all">
                View All Alerts ({alerts.length})
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
