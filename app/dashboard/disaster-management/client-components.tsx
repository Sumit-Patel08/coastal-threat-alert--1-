"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Package, Truck, Home, Droplets, Utensils } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RiskAssessment {
  id: string
  region: string
  risk_level: string
  sea_level: number
  cyclones: number
  pollution: string
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
  created_at: string
  updated_at: string
}

interface Resource {
  id: string
  name: string
  type: string
  quantity: number
  available: number
  status: string
}

// This hook will be used by individual components
export function useDisasterManagement() {
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([])
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([])
  const [resources, setResources] = useState<Resource[]>([
    { id: '1', name: 'Rescue Boats', type: 'boats', quantity: 25, available: 18, status: 'active' },
    { id: '2', name: 'Ambulances', type: 'ambulances', quantity: 15, available: 12, status: 'active' },
    { id: '3', name: 'Emergency Shelters', type: 'shelters', quantity: 50, available: 35, status: 'active' },
    { id: '4', name: 'Food Supplies (tons)', type: 'food', quantity: 100, available: 75, status: 'active' },
    { id: '5', name: 'Water Supplies (liters)', type: 'water', quantity: 50000, available: 35000, status: 'active' },
  ])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  // Form states
  const [riskForm, setRiskForm] = useState({
    region: '',
    risk_level: '',
    sea_level: '',
    cyclones: '',
    pollution: '',
    population_density: ''
  })
  const [alertForm, setAlertForm] = useState({
    type: '',
    severity: '',
    location: '',
    description: ''
  })
  const [editingRisk, setEditingRisk] = useState<RiskAssessment | null>(null)
  const [editingAlert, setEditingAlert] = useState<AlertLog | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch risk assessments
      const { data: risks, error: riskError } = await supabase
        .from('risk_assessments')
        .select('*')
        .order('created_at', { ascending: false })

      if (riskError && riskError.code !== '42P01') {
        console.error('Risk assessments error:', riskError)
      } else if (risks) {
        setRiskAssessments(risks)
      }

      // Fetch alert logs
      const { data: alerts, error: alertError } = await supabase
        .from('alert_logs')
        .select('*')
        .order('created_at', { ascending: false })

      if (alertError && alertError.code !== '42P01') {
        console.error('Alert logs error:', alertError)
      } else if (alerts) {
        setAlertLogs(alerts)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRiskSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        region: riskForm.region,
        risk_level: riskForm.risk_level,
        sea_level: parseFloat(riskForm.sea_level),
        cyclones: parseInt(riskForm.cyclones),
        pollution: riskForm.pollution,
        population_density: parseInt(riskForm.population_density)
      }

      if (editingRisk) {
        const { error } = await supabase
          .from('risk_assessments')
          .update(data)
          .eq('id', editingRisk.id)
        
        if (error) throw error
        toast({ title: "Risk assessment updated successfully" })
      } else {
        const { error } = await supabase
          .from('risk_assessments')
          .insert([data])
        
        if (error) throw error
        toast({ title: "Risk assessment created successfully" })
      }

      setRiskForm({ region: '', risk_level: '', sea_level: '', cyclones: '', pollution: '', population_density: '' })
      setEditingRisk(null)
      fetchData()
    } catch (error) {
      console.error('Risk submit error:', error)
      toast({ title: "Error saving risk assessment", variant: "destructive" })
    }
  }

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        type: alertForm.type,
        severity: alertForm.severity,
        location: alertForm.location,
        description: alertForm.description
      }

      if (editingAlert) {
        const { error } = await supabase
          .from('alert_logs')
          .update(data)
          .eq('id', editingAlert.id)
        
        if (error) throw error
        toast({ title: "Alert updated successfully" })
      } else {
        const { error } = await supabase
          .from('alert_logs')
          .insert([data])
        
        if (error) throw error
        toast({ title: "Alert created successfully" })
      }

      setAlertForm({ type: '', severity: '', location: '', description: '' })
      setEditingAlert(null)
      fetchData()
    } catch (error) {
      console.error('Alert submit error:', error)
      toast({ title: "Error saving alert", variant: "destructive" })
    }
  }

  const deleteRisk = async (id: string) => {
    try {
      const { error } = await supabase
        .from('risk_assessments')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      toast({ title: "Risk assessment deleted successfully" })
      fetchData()
    } catch (error) {
      console.error('Delete risk error:', error)
      toast({ title: "Error deleting risk assessment", variant: "destructive" })
    }
  }

  const deleteAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alert_logs')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      toast({ title: "Alert deleted successfully" })
      fetchData()
    } catch (error) {
      console.error('Delete alert error:', error)
      toast({ title: "Error deleting alert", variant: "destructive" })
    }
  }

  const updateResource = (id: string, field: 'quantity' | 'available', value: number) => {
    setResources(prev => prev.map(resource => 
      resource.id === id ? { ...resource, [field]: value } : resource
    ))
    toast({ title: "Resource updated successfully" })
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'boats': return <Truck className="h-4 w-4" />
      case 'ambulances': return <Truck className="h-4 w-4" />
      case 'shelters': return <Home className="h-4 w-4" />
      case 'food': return <Utensils className="h-4 w-4" />
      case 'water': return <Droplets className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  return {
    riskAssessments,
    alertLogs,
    resources,
    loading,
    riskForm,
    setRiskForm,
    alertForm,
    setAlertForm,
    editingRisk,
    setEditingRisk,
    editingAlert,
    setEditingAlert,
    handleRiskSubmit,
    handleAlertSubmit,
    deleteRisk,
    deleteAlert,
    updateResource,
    getResourceIcon
  }
}

export function ResourceManagementCard() {
  const { resources, updateResource, getResourceIcon } = useDisasterManagement()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Management</CardTitle>
        <CardDescription>Monitor and update available emergency resources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resources.map((resource) => (
            <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getResourceIcon(resource.type)}
                <div>
                  <div className="font-medium">{resource.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Available: {resource.available} / {resource.quantity}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={resource.available}
                  onChange={(e) => updateResource(resource.id, 'available', parseInt(e.target.value) || 0)}
                  className="w-20"
                  min="0"
                  max={resource.quantity}
                />
                <Badge variant={resource.available > resource.quantity * 0.5 ? "default" : "destructive"}>
                  {resource.available > resource.quantity * 0.5 ? "Good" : "Low"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function RiskAssessmentTab() {
  const {
    riskAssessments,
    loading,
    riskForm,
    setRiskForm,
    editingRisk,
    setEditingRisk,
    handleRiskSubmit,
    deleteRisk
  } = useDisasterManagement()

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Risk Assessment</DialogTitle>
              <DialogDescription>Create a new coastal risk assessment</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRiskSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={riskForm.region}
                    onChange={(e) => setRiskForm(prev => ({ ...prev, region: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
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
                <div className="grid gap-2">
                  <Label htmlFor="sea_level">Sea Level (m)</Label>
                  <Input
                    id="sea_level"
                    type="number"
                    step="0.1"
                    value={riskForm.sea_level}
                    onChange={(e) => setRiskForm(prev => ({ ...prev, sea_level: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cyclones">Cyclone Count</Label>
                  <Input
                    id="cyclones"
                    type="number"
                    value={riskForm.cyclones}
                    onChange={(e) => setRiskForm(prev => ({ ...prev, cyclones: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pollution">Pollution Level</Label>
                  <Select value={riskForm.pollution} onValueChange={(value) => setRiskForm(prev => ({ ...prev, pollution: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pollution level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="population_density">Population Density</Label>
                  <Input
                    id="population_density"
                    type="number"
                    value={riskForm.population_density}
                    onChange={(e) => setRiskForm(prev => ({ ...prev, population_density: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Assessment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {riskAssessments.map((risk) => (
              <div key={risk.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                <div>
                  <div className="font-medium">{risk.region}</div>
                  <div className="text-sm text-muted-foreground">
                    Sea Level: +{risk.sea_level}m | Cyclones: {risk.cyclones} | Pollution: {risk.pollution} | Population: {risk.population_density}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={risk.risk_level === "High" ? "destructive" : risk.risk_level === "Medium" ? "default" : "secondary"}>
                    {risk.risk_level} Risk
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => setEditingRisk(risk)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteRisk(risk.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {riskAssessments.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No risk assessments found. Add one to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AlertLogsTab() {
  const {
    alertLogs,
    loading,
    alertForm,
    setAlertForm,
    editingAlert,
    setEditingAlert,
    handleAlertSubmit,
    deleteAlert
  } = useDisasterManagement()

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
              Add Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Alert Log</DialogTitle>
              <DialogDescription>Create a new alert entry</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAlertSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Alert Type</Label>
                  <Input
                    id="type"
                    value={alertForm.type}
                    onChange={(e) => setAlertForm(prev => ({ ...prev, type: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={alertForm.severity} onValueChange={(value) => setAlertForm(prev => ({ ...prev, severity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={alertForm.location}
                    onChange={(e) => setAlertForm(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={alertForm.description}
                    onChange={(e) => setAlertForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Alert</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {alertLogs.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                <div>
                  <div className="font-medium">{alert.type}</div>
                  <div className="text-sm text-muted-foreground">{alert.location}</div>
                  <div className="text-sm text-muted-foreground mt-1">{alert.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={alert.severity === "Critical" ? "destructive" : alert.severity === "High" ? "default" : "secondary"}>
                    {alert.severity}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => setEditingAlert(alert)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteAlert(alert.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {alertLogs.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No alerts found. Add one to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
