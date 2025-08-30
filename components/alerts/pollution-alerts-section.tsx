"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PollutionInvestigation } from "./pollution-investigation"

interface PollutionAlert {
  id: number
  type: "Algal Bloom" | "Plastic Pollution" | "Oil Spill" | "Sewage Discharge"
  location: string
  severity: "Critical" | "High" | "Medium" | "Low"
  area: string
}

const pollutionAlerts: PollutionAlert[] = [
  { id: 1, type: "Algal Bloom", location: "Mumbai Coast", severity: "High", area: "15 km²" },
  { id: 2, type: "Plastic Pollution", location: "Chennai Coast", severity: "Medium", area: "8 km²" },
  { id: 3, type: "Oil Spill", location: "Kolkata Coast", severity: "Critical", area: "25 km²" },
  { id: 4, type: "Sewage Discharge", location: "Kochi Coast", severity: "Low", area: "3 km²" },
]

export function PollutionAlertsSection() {
  const [selectedAlert, setSelectedAlert] = useState<PollutionAlert | null>(null)

  const handleInvestigate = (alert: PollutionAlert) => {
    setSelectedAlert(alert)
  }

  const handleBack = () => {
    setSelectedAlert(null)
  }

  if (selectedAlert) {
    return <PollutionInvestigation alert={selectedAlert} onBack={handleBack} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pollution & Environmental Alerts</CardTitle>
        <CardDescription>Active environmental threats and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pollutionAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{alert.type}</div>
                <div className="text-sm text-muted-foreground">{alert.location} • Area: {alert.area}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={alert.severity === "Critical" ? "destructive" : alert.severity === "High" ? "destructive" : alert.severity === "Medium" ? "default" : "secondary"}>
                  {alert.severity}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => handleInvestigate(alert)}>
                  Investigate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
