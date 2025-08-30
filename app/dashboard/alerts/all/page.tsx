"use client"

import { useState } from "react"
import { HydrationBoundary } from "@/components/ui/hydration-boundary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertTriangle, Search, Filter, MapPin, Clock, ArrowLeft, Calendar } from "lucide-react"
import { mockAlerts, getSeverityColor, getSeverityBadgeVariant, type Alert } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function AllAlertsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter
    const matchesCategory = categoryFilter === "all" || alert.category === categoryFilter
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter

    return matchesSearch && matchesSeverity && matchesCategory && matchesStatus
  })

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

  const clearFilters = () => {
    setSearchTerm("")
    setSeverityFilter("all")
    setCategoryFilter("all")
    setStatusFilter("all")
  }

  return (
    <HydrationBoundary>
      <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/fisherfolk">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">All Alerts</h1>
          <p className="text-muted-foreground">
            Complete alert history with advanced filtering
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  suppressHydrationWarning
                />
              </div>
            </div>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="sea-level">Sea Level</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="cyclone">Cyclone</SelectItem>
                <SelectItem value="tsunami">Tsunami</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredAlerts.length} of {mockAlerts.length} alerts
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters} suppressHydrationWarning>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No alerts found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {alert.status === "active" ? "🔴 Active" : alert.status === "monitoring" ? "🟡 Monitoring" : "🟢 Resolved"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Issued {formatTime(alert.timeIssued)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Updated {formatTime(alert.lastUpdate)}
                      </div>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        View Details
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
                </div>
                
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  <div className="text-sm font-medium text-blue-800 mb-1">
                    Quick Actions:
                  </div>
                  <div className="text-sm text-blue-700">
                    {alert.safetyActions.slice(0, 2).join(" • ")}
                    {alert.safetyActions.length > 2 && " • ..."}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </div>
    </HydrationBoundary>
  )
}
