"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, TrendingUp, Map, Activity } from "lucide-react"
import {
  CoastalThreatOverview,
  RiskAssessmentTab,
  AlertLogsTab,
  useCoastalThreatData
} from "./components"
import { HistoricalTrendsTab } from "./historical-trends"
import { CitySelector } from "./city-selector"
import { AlertsDropdown } from "./alerts-dropdown"
import { ResourceManagementCard } from "./resource-management"

export function DashboardClient() {
  const {
    riskAssessments,
    alertLogs,
    loading,
    selectedCity,
    setSelectedCity,
    coastalCities,
    aiAnalysisRunning,
    runAIAnalysis,
    resources,
    updateResource,
    getResourceIcon,
    isEditMode,
    setIsEditMode,
    passwordInput,
    setPasswordInput,
    showPasswordDialog,
    setShowPasswordDialog,
    handlePasswordSubmit
  } = useCoastalThreatData()

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard...</div>
  }

  const activeAlerts = alertLogs?.filter(alert => alert.severity === 'Critical' || alert.severity === 'High').length || 0
  const highRiskZones = riskAssessments?.filter(r => r.risk_level === 'High').length || 0
  const avgSeaLevel = riskAssessments?.length 
    ? (riskAssessments.reduce((sum, r) => sum + r.sea_level, 0) / riskAssessments.length).toFixed(1)
    : "0.0"
  const totalCyclones = riskAssessments?.reduce((sum, r) => sum + r.cyclones, 0) || 0

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Disaster Management System</h1>
          <p className="text-muted-foreground">
            Fully automated threat detection and emergency response coordination
          </p>
        </div>
        <AlertsDropdown />
      </div>

      <CitySelector 
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        coastalCities={coastalCities}
        aiAnalysisRunning={aiAnalysisRunning}
        runAIAnalysis={runAIAnalysis}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="risk-assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="alerts">Alert Logs</TabsTrigger>
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeAlerts}</div>
                <p className="text-xs text-muted-foreground">
                  Critical & High severity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk Zones</CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{highRiskZones}</div>
                <p className="text-xs text-muted-foreground">
                  Regions requiring attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Sea Level</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgSeaLevel}m</div>
                <p className="text-xs text-muted-foreground">
                  Above normal levels
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storm Systems</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCyclones}</div>
                <p className="text-xs text-muted-foreground">
                  Tracked cyclones
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest threat notifications for {selectedCity}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alertLogs?.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">{alert.type}</div>
                        <div className="text-xs text-muted-foreground">{alert.location}</div>
                      </div>
                      <Badge variant={
                        alert.severity === 'Critical' ? 'destructive' : 
                        alert.severity === 'High' ? 'destructive' : 
                        alert.severity === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center text-muted-foreground py-4">
                      No recent alerts
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <CoastalThreatOverview />
          </div>
          
          <ResourceManagementCard 
            resources={resources}
            updateResource={updateResource}
            getResourceIcon={getResourceIcon}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            passwordInput={passwordInput}
            setPasswordInput={setPasswordInput}
            showPasswordDialog={showPasswordDialog}
            setShowPasswordDialog={setShowPasswordDialog}
            handlePasswordSubmit={handlePasswordSubmit}
          />
        </TabsContent>

        <TabsContent value="risk-assessment" className="space-y-4">
          <RiskAssessmentTab />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <AlertLogsTab />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <HistoricalTrendsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
