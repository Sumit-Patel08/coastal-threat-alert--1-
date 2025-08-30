import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard/shell"
import { AlertsList } from "@/components/alerts/alerts-list"
import { AlertComposer } from "@/components/alerts/alert-composer"
import { DispatchLogList } from "@/components/alerts/dispatch-log-list"

export default function CommunityDashboard() {
  return (
    <DashboardShell role="Community Leader">
      <div id="overview" className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Neighborhood Watch</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Share preparedness resources with residents.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Events</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Town hall on coastal resilience (mock).</CardContent>
        </Card>
      </div>
      <div id="alerts" className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <AlertComposer />
          <DispatchLogList />
        </div>
        <div>
          <AlertsList title="Community Alerts" />
        </div>
      </div>
    </DashboardShell>
  )
}
