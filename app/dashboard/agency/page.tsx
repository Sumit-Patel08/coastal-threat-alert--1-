import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard/shell"
import { AlertsList } from "@/components/alerts/alerts-list"
import { AlertComposer } from "@/components/alerts/alert-composer"
import { DispatchLogList } from "@/components/alerts/dispatch-log-list"

export default function AgencyDashboard() {
  return (
    <DashboardShell role="Agency">
      <div id="overview" className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Region Status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No active warnings. Preparedness level: Green.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Open Tasks</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Coordinate drills and data validation (mock).
          </CardContent>
        </Card>
      </div>
      <div id="alerts" className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <AlertComposer />
          <DispatchLogList />
        </div>
        <div>
          <AlertsList title="Agency Alerts" />
        </div>
      </div>
    </DashboardShell>
  )
}
