import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard/shell"
import { AlertsList } from "@/components/alerts/alerts-list"
import { AlertComposer } from "@/components/alerts/alert-composer"
import { DispatchLogList } from "@/components/alerts/dispatch-log-list"

export default function AdminDashboard() {
  return (
    <DashboardShell role="Admin">
      <div id="overview" className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Health</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            All services operational. No outages reported.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">0 users (demo). Auth wiring coming next.</CardContent>
        </Card>
      </div>
      <div id="alerts" className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <AlertComposer />
          <DispatchLogList title="My Dispatches" />
        </div>
        <div>
          <AlertsList title="Recent Alerts" />
        </div>
      </div>
      <div id="settings" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Manage roles, RLS policies, and integrations.
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
