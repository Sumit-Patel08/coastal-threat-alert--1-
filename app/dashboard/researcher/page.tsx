import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard/shell"
import { AlertsList } from "@/components/alerts/alerts-list"
import { RuleDetectionPanel } from "@/components/ml/rule-detection-panel"

export default function ResearcherDashboard() {
  return (
    <DashboardShell role="Researcher">
      <div id="overview" className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datasets</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Import sea-level, surge, and shoreline change datasets (mock).
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exports</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            CSV/GeoJSON export stubs and provenance notes.
          </CardContent>
        </Card>
      </div>
      <div id="insights" className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Model Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Placeholder for simple rule-based detection demo.
          </CardContent>
        </Card>
        <RuleDetectionPanel />
      </div>
      <AlertsList title="Research Alerts" />
    </DashboardShell>
  )
}
