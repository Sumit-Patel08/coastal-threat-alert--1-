"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Truck, Home, Droplets, Utensils, Waves, Cloud, MapPin, Shield, TrendingUp, Activity, RefreshCw, Bot, Zap, Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface RiskAssessment {
  id: string
  region: string
  risk_level: string
  sea_level: number
  cyclones: number
  pollution: string
  algal_blooms: string
  illegal_activities: string
  population_density: number
  created_at: string
  updated_at: string
}

interface AlertLog {
  id: string
  type: string
  severity: string
  location: string
  description: string
  source: string
  created_at: string
  updated_at: string
}

interface SensorData {
  id: string
  sensor_type: string
  location: string
  value: number
  unit: string
  timestamp: string
}

interface Resource {
  id: string
  name: string
  type: string
  quantity: number
  available: number
  status: string
}

export function useCoastalThreatData() {
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([])
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([])
  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [selectedCity, setSelectedCity] = useState('Mumbai')
  const [isEditMode, setIsEditMode] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  
  const coastalCities = [
    'Mumbai', 'Chennai', 'Kolkata', 'Kochi', 'Visakhapatnam', 'Goa', 'Mangalore', 
    'Puducherry', 'Thiruvananthapuram', 'Bhubaneswar', 'Surat', 'Vadodara',
    'Ahmedabad', 'Rajkot', 'Bhavnagar', 'Porbandar', 'Dwarka', 'Okha'
  ]
  const [aiAnalysisRunning, setAiAnalysisRunning] = useState(false)
  const [resources, setResources] = useState<Resource[]>([
    { id: "1", name: "Emergency Boats", type: "rescue", quantity: 15, available: 12, status: "good" },
    { id: "2", name: "Ambulances", type: "medical", quantity: 8, available: 6, status: "good" },
    { id: "3", name: "Emergency Shelters", type: "shelter", quantity: 25, available: 18, status: "low" },
    { id: "4", name: "Food Supplies (tons)", type: "food", quantity: 50, available: 35, status: "good" },
    { id: "5", name: "Water Supplies (liters)", type: "water", quantity: 10000, available: 7500, status: "good" }
  ])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [riskForm, setRiskForm] = useState({
    region: "",
    risk_level: "",
    sea_level: "",
    cyclones: "",
    pollution: "",
    algal_blooms: "",
    illegal_activities: "",
    population_density: ""
  })

  const [alertForm, setAlertForm] = useState({
    type: "",
    severity: "",
    location: "",
    description: "",
    source: ""
  })

  const [editingRisk, setEditingRisk] = useState<string | null>(null)
  const [editingAlert, setEditingAlert] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
    startAutomatedAnalysis()
  }, [selectedCity])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!aiAnalysisRunning) {
        runAIAnalysis()
      }
    }, 30000) // Run AI analysis every 30 seconds
    
    return () => clearInterval(interval)
  }, [selectedCity, aiAnalysisRunning])

  const fetchData = async () => {
    try {
      const [risks, alerts, sensors] = await Promise.all([
        supabase.from('risk_assessments').select('*').order('created_at', { ascending: false }),
        supabase.from('alert_logs').select('*').order('created_at', { ascending: false }),
        supabase.from('sensor_data').select('*').order('timestamp', { ascending: false }).limit(50)
      ])

      if (risks.data) setRiskAssessments(risks.data)
      if (alerts.data) setAlertLogs(alerts.data)
      if (sensors.data) setSensorData(sensors.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const startAutomatedAnalysis = async () => {
    // Fetch real-time weather data
    await fetch(`/api/weather?city=${selectedCity}`)
    
    // Run AI analysis
    await runAIAnalysis()
  }

  const runAIAnalysis = async () => {
    if (aiAnalysisRunning) return
    
    setAiAnalysisRunning(true)
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: selectedCity })
      })
      
      if (response.ok) {
        const result = await response.json()
        toast({ 
          title: "AI Analysis Complete", 
          description: `Generated ${result.alerts?.length || 0} alerts for ${selectedCity}` 
        })
        fetchData() // Refresh data after AI analysis
      }
    } catch (error) {
      console.error('AI analysis failed:', error)
    } finally {
      setAiAnalysisRunning(false)
    }
  }

  const handleRiskSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const riskData = {
        region: riskForm.region,
        risk_level: riskForm.risk_level,
        sea_level: parseFloat(riskForm.sea_level),
        cyclones: parseInt(riskForm.cyclones),
        pollution: riskForm.pollution,
        algal_blooms: riskForm.algal_blooms,
        illegal_activities: riskForm.illegal_activities,
        population_density: parseInt(riskForm.population_density)
      }

      if (editingRisk) {
        await supabase.from('risk_assessments').update(riskData).eq('id', editingRisk)
        toast({ title: "Risk assessment updated successfully" })
      } else {
        await supabase.from('risk_assessments').insert(riskData)
        toast({ title: "Risk assessment created successfully" })
      }

      setRiskForm({
        region: "", risk_level: "", sea_level: "", cyclones: "",
        pollution: "", algal_blooms: "", illegal_activities: "", population_density: ""
      })
      setEditingRisk(null)
      fetchData()
    } catch (error) {
      toast({ title: "Error saving risk assessment", variant: "destructive" })
    }
  }

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const alertData = {
        type: alertForm.type,
        severity: alertForm.severity,
        location: alertForm.location,
        description: alertForm.description,
        source: alertForm.source
      }

      if (editingAlert) {
        await supabase.from('alert_logs').update(alertData).eq('id', editingAlert)
        toast({ title: "Alert updated successfully" })
      } else {
        await supabase.from('alert_logs').insert(alertData)
        toast({ title: "Alert created successfully" })
      }

      setAlertForm({ type: "", severity: "", location: "", description: "", source: "" })
      setEditingAlert(null)
      fetchData()
    } catch (error) {
      toast({ title: "Error saving alert", variant: "destructive" })
    }
  }

  const deleteRisk = async (id: string) => {
    try {
      await supabase.from('risk_assessments').delete().eq('id', id)
      toast({ title: "Risk assessment deleted successfully" })
      fetchData()
    } catch (error) {
      toast({ title: "Error deleting risk assessment", variant: "destructive" })
    }
  }

  const deleteAlert = async (id: string) => {
    try {
      await supabase.from('alert_logs').delete().eq('id', id)
      toast({ title: "Alert deleted successfully" })
      fetchData()
    } catch (error) {
      toast({ title: "Error deleting alert", variant: "destructive" })
    }
  }

  const updateResource = (id: string, field: string, value: number) => {
    setResources(prev => prev.map(resource => 
      resource.id === id 
        ? { 
            ...resource, 
            [field]: value,
            status: field === 'available' && value < resource.quantity * 0.3 ? 'low' : 'good'
          }
        : resource
    ))
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'rescue': return <Package className="h-4 w-4" />
      case 'medical': return <Truck className="h-4 w-4" />
      case 'shelter': return <Home className="h-4 w-4" />
      case 'water': return <Droplets className="h-4 w-4" />
      case 'food': return <Utensils className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const handlePasswordSubmit = () => {
    if (passwordInput === 'Neel123') {
      setIsEditMode(true)
      setShowPasswordDialog(false)
      setPasswordInput('')
      toast({ title: "Access granted - Edit mode enabled" })
    } else {
      toast({ title: "Incorrect password", variant: "destructive" })
      setPasswordInput('')
    }
  }

  return {
    riskAssessments, alertLogs, sensorData, resources, loading,
    riskForm, setRiskForm, alertForm, setAlertForm,
    editingRisk, setEditingRisk, editingAlert, setEditingAlert,
    handleRiskSubmit, handleAlertSubmit, deleteRisk, deleteAlert,
    updateResource, getResourceIcon, fetchData, selectedCity, setSelectedCity,
    coastalCities, isEditMode, setIsEditMode, passwordInput, setPasswordInput,
    showPasswordDialog, setShowPasswordDialog, handlePasswordSubmit, aiAnalysisRunning, runAIAnalysis
  }
}

export function CoastalThreatOverview() {
  const { sensorData, selectedCity } = useCoastalThreatData()
  
  // Get latest sensor readings for the selected city
  const latestData = sensorData.filter(data => data.location.includes(selectedCity)).slice(0, 6)
  
  const getThreatLevel = (value: number, type: string) => {
    switch (type) {
      case 'tide_gauge':
        return value > 2.0 ? 'Critical' : value > 1.5 ? 'High' : 'Normal'
      case 'weather_station':
        return value > 40 ? 'Critical' : value > 25 ? 'High' : 'Normal'
      case 'pollution_sensor':
        return value > 100 ? 'Critical' : value > 70 ? 'High' : 'Normal'
      default:
        return 'Normal'
    }
  }
  
  const getThreatColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-red-500'
      case 'High': return 'text-orange-500'
      default: return 'text-green-500'
    }
  }
  
  const getThreatVariant = (level: string) => {
    switch (level) {
      case 'Critical': return 'destructive'
      case 'High': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Threat Indicators
        </CardTitle>
        <CardDescription>Real-time AI analysis for {selectedCity}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center gap-2">
                <Waves className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="text-sm font-medium">Sea Level Rise</span>
                  <div className="text-xs text-muted-foreground">Tide gauge readings</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">+2.4m</div>
                <Badge variant="secondary">Elevated</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-orange-500" />
                <div>
                  <span className="text-sm font-medium">Storm Intensity</span>
                  <div className="text-xs text-muted-foreground">Wind speed analysis</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-600">35 km/h</div>
                <Badge variant="secondary">Moderate</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-red-50 to-pink-50">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-red-500" />
                <div>
                  <span className="text-sm font-medium">Pollution Index</span>
                  <div className="text-xs text-muted-foreground">Air & water quality</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-600">125 AQI</div>
                <Badge variant="destructive">Unhealthy</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                <div>
                  <span className="text-sm font-medium">AI Confidence</span>
                  <div className="text-xs text-muted-foreground">Prediction accuracy</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">94.2%</div>
                <Badge variant="outline">High</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function RiskAssessmentTab() {
  const {
    riskAssessments, loading, riskForm, setRiskForm,
    editingRisk, setEditingRisk, handleRiskSubmit, deleteRisk
  } = useCoastalThreatData()

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Risk Assessments</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRisk ? 'Edit' : 'Add'} Risk Assessment</DialogTitle>
              <DialogDescription>
                Assess coastal threats and environmental risks for a specific region.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRiskSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={riskForm.region}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRiskForm(prev => ({ ...prev, region: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="risk_level">Risk Level</Label>
                  <Select value={riskForm.risk_level} onValueChange={(value) => setRiskForm(prev => ({ ...prev, risk_level: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sea_level">Sea Level (m)</Label>
                  <Input
                    id="sea_level"
                    type="number"
                    step="0.1"
                    value={riskForm.sea_level}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRiskForm(prev => ({ ...prev, sea_level: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cyclones">Cyclone Count</Label>
                  <Input
                    id="cyclones"
                    type="number"
                    value={riskForm.cyclones}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRiskForm(prev => ({ ...prev, cyclones: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pollution">Pollution Level</Label>
                  <Select value={riskForm.pollution} onValueChange={(value) => setRiskForm(prev => ({ ...prev, pollution: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pollution level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="algal_blooms">Algal Blooms</Label>
                  <Select value={riskForm.algal_blooms} onValueChange={(value) => setRiskForm(prev => ({ ...prev, algal_blooms: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select algal bloom status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Minor">Minor</SelectItem>
                      <SelectItem value="Major">Major</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="illegal_activities">Illegal Activities</Label>
                  <Select value={riskForm.illegal_activities} onValueChange={(value) => setRiskForm(prev => ({ ...prev, illegal_activities: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="population_density">Population Density</Label>
                  <Input
                    id="population_density"
                    type="number"
                    value={riskForm.population_density}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRiskForm(prev => ({ ...prev, population_density: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingRisk ? 'Update' : 'Create'} Assessment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {riskAssessments.map((risk) => (
          <Card key={risk.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{risk.region}</h4>
                    <Badge variant={risk.risk_level === "High" ? "destructive" : risk.risk_level === "Medium" ? "default" : "secondary"}>
                      {risk.risk_level}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground grid grid-cols-2 gap-4">
                    <span>Sea Level: +{risk.sea_level}m</span>
                    <span>Cyclones: {risk.cyclones}</span>
                    <span>Pollution: {risk.pollution}</span>
                    <span>Algal Blooms: {risk.algal_blooms}</span>
                    <span>Illegal Activities: {risk.illegal_activities}</span>
                    <span>Population: {risk.population_density}/km²</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingRisk(risk.id)
                      setRiskForm({
                        region: risk.region,
                        risk_level: risk.risk_level,
                        sea_level: risk.sea_level.toString(),
                        cyclones: risk.cyclones.toString(),
                        pollution: risk.pollution,
                        algal_blooms: risk.algal_blooms,
                        illegal_activities: risk.illegal_activities,
                        population_density: risk.population_density.toString()
                      })
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteRisk(risk.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function AlertLogsTab() {
  const {
    alertLogs, loading, alertForm, setAlertForm,
    editingAlert, setEditingAlert, handleAlertSubmit, deleteAlert
  } = useCoastalThreatData()

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Alert Logs</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAlert ? 'Edit' : 'Create'} Alert</DialogTitle>
              <DialogDescription>
                Log a new coastal threat alert or update an existing one.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAlertSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Alert Type</Label>
                  <Select value={alertForm.type} onValueChange={(value) => setAlertForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select alert type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Storm Surge">Storm Surge</SelectItem>
                      <SelectItem value="Coastal Erosion">Coastal Erosion</SelectItem>
                      <SelectItem value="Pollution">Pollution</SelectItem>
                      <SelectItem value="Algal Bloom">Algal Bloom</SelectItem>
                      <SelectItem value="Cyclone">Cyclone</SelectItem>
                      <SelectItem value="Illegal Dumping">Illegal Dumping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={alertForm.severity} onValueChange={(value) => setAlertForm(prev => ({ ...prev, severity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={alertForm.location}
                    onChange={(e) => setAlertForm(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select value={alertForm.source} onValueChange={(value) => setAlertForm(prev => ({ ...prev, source: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sensor">Sensor</SelectItem>
                      <SelectItem value="Satellite">Satellite</SelectItem>
                      <SelectItem value="Manual">Manual Entry</SelectItem>
                      <SelectItem value="API">Weather API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={alertForm.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAlertForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">{editingAlert ? 'Update' : 'Create'} Alert</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {alertLogs.map((alert) => (
          <Card key={alert.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{alert.type}</h4>
                    <Badge variant={alert.severity === "Critical" ? "destructive" : alert.severity === "High" ? "default" : "secondary"}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline">{alert.source}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.location}</p>
                  <p className="text-sm">{alert.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingAlert(alert.id)
                      setAlertForm({
                        type: alert.type,
                        severity: alert.severity,
                        location: alert.location,
                        description: alert.description,
                        source: alert.source
                      })
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAlert(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
