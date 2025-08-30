"use client"

import { useState, useEffect } from "react"
import { Bell, AlertTriangle, Info, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"

interface AlertLog {
  id: string
  type: string
  severity: string
  location: string
  description: string
  created_at: string
}

export function AlertsDropdown() {
  const [alerts, setAlerts] = useState<AlertLog[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    fetchRecentAlerts()
    const interval = setInterval(fetchRecentAlerts, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchRecentAlerts = async () => {
    try {
      const { data } = await supabase
        .from('alert_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (data) {
        setAlerts(data)
        setUnreadCount(data.filter(alert => 
          new Date(alert.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length)
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'high': return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'medium': return <Info className="h-4 w-4 text-yellow-500" />
      default: return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="mr-2 h-4 w-4" />
          View All Alerts
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Recent Alerts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <DropdownMenuItem key={alert.id} className="flex flex-col items-start p-3 space-y-1">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(alert.severity)}
                  <span className="font-medium text-sm">{alert.type}</span>
                </div>
                <Badge variant={getSeverityVariant(alert.severity) as any} className="text-xs">
                  {alert.severity}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">{alert.location}</div>
              <div className="text-xs">{alert.description.substring(0, 80)}...</div>
              <div className="text-xs text-muted-foreground">
                {new Date(alert.created_at).toLocaleString()}
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            <div className="text-center text-muted-foreground py-2">
              No recent alerts
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
