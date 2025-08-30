"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, AlertTriangle, MapPin, Calendar, Users, Droplets, Wind, Thermometer, Activity, FileText, Camera, Phone } from "lucide-react"

interface PollutionAlert {
  id: number
  type: "Algal Bloom" | "Plastic Pollution" | "Oil Spill" | "Sewage Discharge"
  location: string
  severity: "Critical" | "High" | "Medium" | "Low"
  area: string
}

interface InvestigationData {
  overview: {
    description: string
    cause: string
    impact: string
    timeline: string
  }
  measurements: {
    pollutantLevel: number
    waterQuality: number
    temperature: number
    pH: number
    oxygenLevel: number
  }
  affectedAreas: {
    zone: string
    severity: "High" | "Medium" | "Low"
    population: number
    ecosystem: string
  }[]
  actions: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  resources: {
    teams: number
    equipment: string[]
    budget: string
  }
}

const investigationDatabase: Record<string, InvestigationData> = {
  "Algal Bloom": {
    overview: {
      description: "Harmful algal bloom detected in coastal waters causing discoloration and potential toxicity. The bloom is primarily composed of Karenia brevis species, known for producing neurotoxins.",
      cause: "High nutrient levels from agricultural runoff combined with warm water temperatures and low wind conditions have created ideal conditions for algal growth.",
      impact: "Marine life mortality, respiratory issues in coastal communities, tourism disruption, and fishing industry losses estimated at ₹50 lakhs.",
      timeline: "Bloom detected 3 days ago, peak intensity expected in 2-3 days, natural dissipation estimated in 1-2 weeks."
    },
    measurements: {
      pollutantLevel: 85,
      waterQuality: 25,
      temperature: 32,
      pH: 8.2,
      oxygenLevel: 3.2
    },
    affectedAreas: [
      { zone: "Mumbai Harbor", severity: "High", population: 25000, ecosystem: "Mangrove wetlands" },
      { zone: "Worli Bay", severity: "Medium", population: 15000, ecosystem: "Coastal reef" },
      { zone: "Mahim Creek", severity: "Low", population: 8000, ecosystem: "Mudflats" }
    ],
    actions: {
      immediate: ["Deploy water quality monitoring buoys", "Issue public health advisory", "Restrict fishing activities", "Monitor marine life"],
      shortTerm: ["Nutrient source investigation", "Water treatment deployment", "Community health screening", "Economic impact assessment"],
      longTerm: ["Agricultural runoff controls", "Coastal restoration", "Early warning system", "Policy recommendations"]
    },
    resources: {
      teams: 12,
      equipment: ["Water quality sensors", "Drone surveillance", "Sample collection kits", "Mobile lab units"],
      budget: "₹15 lakhs"
    }
  },
  "Plastic Pollution": {
    overview: {
      description: "Significant accumulation of plastic debris along Chennai coastline, with microplastics detected in marine food chain. Primary sources include single-use plastics and fishing gear.",
      cause: "Inadequate waste management systems, monsoon-driven land-based pollution, and marine dumping from fishing vessels.",
      impact: "Marine ecosystem disruption, microplastic contamination in seafood, beach tourism decline, and threat to endangered sea turtle nesting sites.",
      timeline: "Pollution levels increasing over past 6 months, critical threshold reached last week, cleanup operations initiated."
    },
    measurements: {
      pollutantLevel: 70,
      waterQuality: 45,
      temperature: 28,
      pH: 7.8,
      oxygenLevel: 6.1
    },
    affectedAreas: [
      { zone: "Marina Beach", severity: "High", population: 50000, ecosystem: "Sandy shore" },
      { zone: "Elliots Beach", severity: "Medium", population: 20000, ecosystem: "Rocky intertidal" },
      { zone: "Covelong Beach", severity: "Medium", population: 12000, ecosystem: "Turtle nesting site" }
    ],
    actions: {
      immediate: ["Beach cleanup mobilization", "Plastic debris mapping", "Marine life rescue operations", "Public awareness campaign"],
      shortTerm: ["Waste source tracking", "Recycling facility setup", "Fisher community engagement", "Microplastic sampling"],
      longTerm: ["Plastic ban enforcement", "Circular economy initiatives", "Marine protected areas", "International cooperation"]
    },
    resources: {
      teams: 8,
      equipment: ["Beach cleaning machinery", "Plastic sorting units", "GPS mapping devices", "Microscopy equipment"],
      budget: "₹25 lakhs"
    }
  },
  "Oil Spill": {
    overview: {
      description: "Major oil spill incident near Kolkata port affecting 25 km² of coastal waters. Estimated 500 tons of crude oil released from tanker vessel during loading operations.",
      cause: "Equipment failure during oil transfer operations at Haldia port, compounded by rough sea conditions and inadequate safety protocols.",
      impact: "Severe marine ecosystem damage, fishing industry shutdown, coastal community health risks, and potential long-term environmental contamination.",
      timeline: "Spill occurred 18 hours ago, containment efforts ongoing, oil reaching shoreline in next 6-12 hours."
    },
    measurements: {
      pollutantLevel: 95,
      waterQuality: 15,
      temperature: 26,
      pH: 7.2,
      oxygenLevel: 2.8
    },
    affectedAreas: [
      { zone: "Haldia Port", severity: "High", population: 35000, ecosystem: "Industrial coastal" },
      { zone: "Digha Beach", severity: "High", population: 40000, ecosystem: "Tourist beach" },
      { zone: "Sundarbans Edge", severity: "Medium", population: 15000, ecosystem: "Mangrove forest" }
    ],
    actions: {
      immediate: ["Deploy oil containment booms", "Activate emergency response teams", "Evacuate coastal communities", "Wildlife rescue operations"],
      shortTerm: ["Oil recovery operations", "Shoreline protection", "Health monitoring", "Environmental assessment"],
      longTerm: ["Ecosystem restoration", "Compensation programs", "Safety protocol review", "Legal proceedings"]
    },
    resources: {
      teams: 25,
      equipment: ["Oil skimmers", "Containment booms", "Dispersant systems", "Protective gear"],
      budget: "₹2 crores"
    }
  },
  "Sewage Discharge": {
    overview: {
      description: "Untreated sewage discharge detected in Kochi backwaters causing bacterial contamination and eutrophication. Multiple outfall points identified along urban coastline.",
      cause: "Overloaded sewage treatment plants, illegal discharge connections, and monsoon-induced overflow from municipal systems.",
      impact: "Water-borne disease risks, fish kills, tourism impact, and degradation of unique backwater ecosystem.",
      timeline: "Discharge ongoing for 2 weeks, bacterial levels peaked yesterday, treatment upgrades planned next month."
    },
    measurements: {
      pollutantLevel: 60,
      waterQuality: 35,
      temperature: 30,
      pH: 7.5,
      oxygenLevel: 4.5
    },
    affectedAreas: [
      { zone: "Vembanad Lake", severity: "Medium", population: 30000, ecosystem: "Backwater lagoon" },
      { zone: "Fort Kochi", severity: "Low", population: 18000, ecosystem: "Historic waterfront" },
      { zone: "Kumrakom", severity: "Low", population: 8000, ecosystem: "Bird sanctuary" }
    ],
    actions: {
      immediate: ["Water quality testing", "Public health warnings", "Source identification", "Temporary treatment setup"],
      shortTerm: ["Sewage system repairs", "Alternative discharge routes", "Community health monitoring", "Tourism sector support"],
      longTerm: ["Infrastructure upgrades", "Waste management policy", "Ecosystem restoration", "Monitoring systems"]
    },
    resources: {
      teams: 6,
      equipment: ["Water testing kits", "Portable treatment units", "Mapping equipment", "Health screening tools"],
      budget: "₹8 lakhs"
    }
  }
}

interface PollutionInvestigationProps {
  alert: PollutionAlert | null
  onBack: () => void
}

export function PollutionInvestigation({ alert, onBack }: PollutionInvestigationProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!alert) {
    return null
  }

  const data = investigationDatabase[alert.type]
  const { measurements } = data

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive"
      case "High": return "destructive"
      case "Medium": return "default"
      case "Low": return "secondary"
      default: return "secondary"
    }
  }

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-red-500"
    if (value >= 60) return "bg-orange-500"
    if (value >= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Alerts
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{alert.type} Investigation</h1>
          <p className="text-muted-foreground">{alert.location} • {alert.area}</p>
        </div>
        <Badge variant={getSeverityColor(alert.severity)} className="ml-auto">
          {alert.severity} Priority
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Incident Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700">{data.overview.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Root Cause</h3>
                <p className="text-sm text-gray-700">{data.overview.cause}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Environmental Impact</h3>
                <p className="text-sm text-gray-700">{data.overview.impact}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Timeline</h3>
                <p className="text-sm text-gray-700">{data.overview.timeline}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Response Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold">{data.resources.teams}</div>
                  <div className="text-sm text-gray-600">Response Teams</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{data.resources.equipment.length}</div>
                  <div className="text-sm text-gray-600">Equipment Types</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{data.resources.budget}</div>
                  <div className="text-sm text-gray-600">Allocated Budget</div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Deployed Equipment</h4>
                <div className="flex flex-wrap gap-2">
                  {data.resources.equipment.map((item, index) => (
                    <Badge key={index} variant="outline">{item}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Environmental Measurements
              </CardTitle>
              <CardDescription>Real-time monitoring data from field sensors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Pollutant Level</span>
                    <span className="text-sm text-gray-600">{measurements.pollutantLevel}%</span>
                  </div>
                  <Progress value={measurements.pollutantLevel} className={getProgressColor(measurements.pollutantLevel)} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Water Quality Index</span>
                    <span className="text-sm text-gray-600">{measurements.waterQuality}%</span>
                  </div>
                  <Progress value={measurements.waterQuality} className="bg-blue-500" />
                </div>
                <div className="flex items-center gap-3">
                  <Thermometer className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="font-medium">{measurements.temperature}°C</div>
                    <div className="text-sm text-gray-600">Water Temperature</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">pH {measurements.pH}</div>
                    <div className="text-sm text-gray-600">Acidity Level</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wind className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">{measurements.oxygenLevel} mg/L</div>
                    <div className="text-sm text-gray-600">Dissolved Oxygen</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Affected Areas Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.affectedAreas.map((area, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{area.zone}</h3>
                      <Badge variant={getSeverityColor(area.severity)}>{area.severity} Impact</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Population at Risk</div>
                        <div className="text-gray-600">{area.population.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Ecosystem Type</div>
                        <div className="text-gray-600">{area.ecosystem}</div>
                      </div>
                      <div>
                        <div className="font-medium">Severity Level</div>
                        <div className="text-gray-600">{area.severity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
