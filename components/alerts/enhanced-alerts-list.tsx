"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AlertTriangle, MapPin, Clock, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { mockAlerts, getSeverityColor, getSeverityBadgeVariant, type Alert } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface EnhancedAlertsListProps {
  title?: string
  maxItems?: number
  showViewAll?: boolean
}

export function EnhancedAlertsList({ 
  title = "Live Alerts", 
  maxItems = 3, 
  showViewAll = true 
}: EnhancedAlertsListProps) {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

  const displayAlerts = maxItems ? mockAlerts.slice(0, maxItems) : mockAlerts

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayAlerts.map((alert) => (
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
                    alert.severity === "critical" && "animate-pulse-critical"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getSeverityBadgeVariant(alert.severity)} className="text-xs">
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {alert.status === "active" ? "🔴 Active" : alert.status === "monitoring" ? "🟡 Monitoring" : "🟢 Resolved"}
                          </span>
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
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedAlert(alert)
                              }}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                                  {alert.severity.toUpperCase()}
                                </Badge>
                                {alert.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Location:</span>
                                  <p className="text-muted-foreground">{alert.location}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Time Issued:</span>
                                  <p className="text-muted-foreground">
                                    {new Date(alert.timeIssued).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium">Last Update:</span>
                                  <p className="text-muted-foreground">
                                    {new Date(alert.lastUpdate).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium">Category:</span>
                                  <p className="text-muted-foreground capitalize">{alert.category}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground">{alert.description}</p>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                                  Safety Actions Required
                                </h4>
                                <div className="space-y-2">
                                  {alert.safetyActions.map((action, index) => (
                                    <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                                      <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {index + 1}
                                      </span>
                                      <span className="text-sm text-blue-800">{action}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {alert.coordinates && (
                                <div>
                                  <h4 className="font-medium mb-2">Location Map</h4>
                                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                      <MapPin className="h-6 w-6 mx-auto mb-1" />
                                      <p className="text-sm">Map: {alert.coordinates.lat}, {alert.coordinates.lng}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
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
                    
                    <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      <div className="text-sm font-medium text-blue-800 mb-2">
                        Immediate Actions Required:
                      </div>
                      <div className="space-y-1">
                        {alert.safetyActions.slice(0, 3).map((action, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-sm text-blue-700">{action}</span>
                          </div>
                        ))}
                        {alert.safetyActions.length > 3 && (
                          <div className="text-xs text-blue-600 mt-1">
                            +{alert.safetyActions.length - 3} more actions (click details for full list)
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
          ))}
          
          {showViewAll && (
            <Button variant="outline" size="sm" className="w-full mt-3" asChild>
              <a href="/dashboard/alerts/all">
                View All Alerts ({mockAlerts.length})
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
