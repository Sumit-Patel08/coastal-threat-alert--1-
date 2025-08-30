"use client"

import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

interface AlertNavigationButtonProps {
  className?: string
}

export function AlertNavigationButton({ className }: AlertNavigationButtonProps) {
  const handleClick = () => {
    // Navigate to alerts tab by updating URL hash
    window.location.hash = 'alerts'
    
    // Also trigger tab change if tabs are controlled by URL
    const alertsTab = document.querySelector('[data-value="alerts"]') as HTMLElement
    if (alertsTab) {
      alertsTab.click()
    }
  }

  return (
    <Button 
      onClick={handleClick} 
      className={className || "gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200"}
    >
      <Bell className="h-4 w-4" />
      View All Alerts
      <div className="w-2 h-2 bg-red-300 rounded-full animate-ping"></div>
    </Button>
  )
}
