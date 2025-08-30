"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Clock, MapPin, Users, CheckCircle, XCircle, Search, Filter, Eye, BarChart3, History as HistoryIcon } from "lucide-react"
import { AlertManagementService } from "@/lib/alert-management"
import { CivilDefenceAlert } from "@/lib/civil-defence-types"
import { languageNames } from "@/lib/message-templates"

export function AlertHistory() {
  const [alerts, setAlerts] = useState<CivilDefenceAlert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<CivilDefenceAlert[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [selectedAlert, setSelectedAlert] = useState<CivilDefenceAlert | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const alertService = AlertManagementService.getInstance()

  useEffect(() => {
    loadAlerts()
  }, [])

  useEffect(() => {
    filterAlerts()
  }, [alerts, searchTerm, statusFilter, severityFilter])

  const loadAlerts = async () => {
    setIsLoading(true)
    try {
      const allAlerts = alertService.getAlerts()
      setAlerts(allAlerts)
    } catch (error) {
      console.error('Failed to load alerts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAlerts = () => {
    let filtered = alerts

    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(alert => alert.status === statusFilter)
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter)
    }

    setFilteredAlerts(filtered)
  }

  const getStatusColor = (status: CivilDefenceAlert['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-500'
      case 'scheduled': return 'bg-blue-500'
      case 'broadcasting': return 'bg-yellow-500'
      case 'sent': return 'bg-green-500'
      case 'expired': return 'bg-gray-400'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getSeverityColor = (severity: CivilDefenceAlert['severity']) => {
    switch (severity) {
      case 'info': return 'text-green-700 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      case 'emergency': return 'text-red-700 bg-red-50 border-red-200'
      default: return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const getDeliveryRate = (alert: CivilDefenceAlert): number => {
    if (alert.deliveryStatus.total === 0) return 0
    return Math.round((alert.deliveryStatus.delivered / alert.deliveryStatus.total) * 100)
  }

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <HistoryIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
              Alert History & Monitoring
            </h2>
            <p className="text-muted-foreground">Track and monitor all coastal alert broadcasts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadAlerts} variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="broadcasting">Broadcasting</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alert Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Alerts</p>
                <p className="text-3xl font-bold text-blue-800">{alerts.length}</p>
                <div className="mt-2">
                  <Progress value={100} className="h-2" />
                </div>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Active Alerts</p>
                <p className="text-3xl font-bold text-red-800">
                  {alerts.filter(a => a.status === 'sent' || a.status === 'broadcasting').length}
                </p>
                <div className="mt-2">
                  <Progress value={alerts.length > 0 ? (alerts.filter(a => a.status === 'sent' || a.status === 'broadcasting').length / alerts.length) * 100 : 0} className="h-2" />
                </div>
              </div>
              <div className="p-3 bg-red-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Reach</p>
                <p className="text-3xl font-bold text-purple-800">
                  {alerts.reduce((sum, alert) => sum + alert.estimatedReach, 0).toLocaleString()}
                </p>
                <div className="mt-2">
                  <Progress value={75} className="h-2" />
                </div>
              </div>
              <div className="p-3 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Avg Delivery Rate</p>
                <p className="text-3xl font-bold text-green-800">
                  {alerts.length > 0 
                    ? Math.round(alerts.reduce((sum, alert) => sum + getDeliveryRate(alert), 0) / alerts.length)
                    : 0}%
                </p>
                <div className="mt-2">
                  <Progress value={alerts.length > 0 ? Math.round(alerts.reduce((sum, alert) => sum + getDeliveryRate(alert), 0) / alerts.length) : 0} className="h-2" />
                </div>
              </div>
              <div className="p-3 bg-green-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading alerts...</div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No alerts found matching your criteria
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(alert.status)}`}></div>
                            <span className="text-sm text-muted-foreground capitalize">
                              {alert.status}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                        
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatTimeAgo(alert.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{alert.affectedZones.length} zone{alert.affectedZones.length !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{alert.estimatedReach.toLocaleString()} recipients</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {alert.status === 'sent' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : alert.status === 'cancelled' ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span>
                              {alert.status === 'sent' 
                                ? `${getDeliveryRate(alert)}% delivered`
                                : alert.status === 'broadcasting'
                                ? 'Broadcasting...'
                                : alert.status}
                            </span>
                          </div>
                        </div>

                        {alert.status === 'sent' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Delivery Progress</span>
                              <span>{alert.deliveryStatus.delivered.toLocaleString()} / {alert.deliveryStatus.total.toLocaleString()}</span>
                            </div>
                            <Progress value={getDeliveryRate(alert)} className="h-2" />
                          </div>
                        )}

                        <div className="mt-3 flex flex-wrap gap-1">
                          {alert.languages.map(lang => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {languageNames[lang]}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedAlert(alert)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Alert Details</DialogTitle>
                            </DialogHeader>
                            {selectedAlert && (
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-medium mb-2">Basic Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><strong>ID:</strong> {selectedAlert.id}</div>
                                      <div><strong>Type:</strong> {selectedAlert.type}</div>
                                      <div><strong>Severity:</strong> {selectedAlert.severity}</div>
                                      <div><strong>Status:</strong> {selectedAlert.status}</div>
                                      <div><strong>Created:</strong> {selectedAlert.createdAt.toLocaleString()}</div>
                                      <div><strong>Updated:</strong> {selectedAlert.updatedAt.toLocaleString()}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Delivery Statistics</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><strong>Total Recipients:</strong> {selectedAlert.deliveryStatus.total.toLocaleString()}</div>
                                      <div><strong>Sent:</strong> {selectedAlert.deliveryStatus.sent.toLocaleString()}</div>
                                      <div><strong>Delivered:</strong> {selectedAlert.deliveryStatus.delivered.toLocaleString()}</div>
                                      <div><strong>Failed:</strong> {selectedAlert.deliveryStatus.failed.toLocaleString()}</div>
                                      <div><strong>Delivery Rate:</strong> {getDeliveryRate(selectedAlert)}%</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Affected Zones</h4>
                                  <div className="grid gap-2 md:grid-cols-2">
                                    {selectedAlert.affectedZones.map(zone => (
                                      <div key={zone.id} className="p-2 bg-gray-50 rounded text-sm">
                                        <div className="font-medium">{zone.name}</div>
                                        <div className="text-muted-foreground">{zone.population.toLocaleString()} population</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Message Templates</h4>
                                  <div className="space-y-2">
                                    {Object.entries(selectedAlert.messageTemplates).map(([lang, message]) => (
                                      <div key={lang} className="p-3 bg-gray-50 rounded">
                                        <div className="font-medium text-sm mb-1">{languageNames[lang as keyof typeof languageNames]}</div>
                                        <div className="text-sm font-mono">{message}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
