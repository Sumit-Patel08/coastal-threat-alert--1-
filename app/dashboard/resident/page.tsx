import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard/shell"
import { AlertsList } from "@/components/alerts/alerts-list"
import { ChatbotPlaceholder } from "@/components/ml/chatbot-placeholder"

export default function ResidentDashboard() {
  return (
    <DashboardShell role="Resident">
      <div id="overview" className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Area</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No active alerts. Evacuation route: Mock Route A.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preparedness</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Checklist: Go-bag, contacts, insurance docs (mock).
          </CardContent>
        </Card>
      </div>
      <div id="map" className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Local Map</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Map preview and bookmarked places will appear here.
          </CardContent>
        </Card>
        <AlertsList title="My Alerts" />
        <ChatbotPlaceholder />
      </div>
    </DashboardShell>
  )
}
